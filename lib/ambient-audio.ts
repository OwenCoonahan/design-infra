/** Original, file-free ambient composition. Construct only after an explicit sound gesture. */
export function createAmbientGraph(context: BaseAudioContext) {
  const nodes: AudioNode[] = []
  const sources: OscillatorNode[] = []
  const own = <T extends AudioNode>(node: T): T => { nodes.push(node); return node }
  const output = own(context.createGain())
  output.gain.value = 0
  const filter = own(context.createBiquadFilter())
  filter.type = "lowpass"
  filter.frequency.value = 1500
  filter.Q.value = 0.4

  const dry = own(context.createGain())
  dry.gain.value = 0.8
  filter.connect(dry).connect(output)
  const room = own(context.createConvolver())
  const impulse = context.createBuffer(2, Math.ceil(context.sampleRate * 2.8), context.sampleRate)
  let seed = 37
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel)
    for (let i = 0; i < data.length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
      data[i] = (seed / 0x100000000 * 2 - 1) * Math.exp(-i / data.length * 6)
    }
  }
  room.buffer = impulse
  const wet = own(context.createGain())
  wet.gain.value = 0.3
  filter.connect(room).connect(wet).connect(output)
  output.connect(context.destination)

  const oscillator = (frequency: number, type: OscillatorType = "sine") => {
    const source = own(context.createOscillator())
    source.type = type
    source.frequency.value = frequency
    sources.push(source)
    return source
  }
  // A slowly breathing Dmaj9 pad, spread across the stereo field.
  for (const [index, frequency] of [146.832, 220, 277.183, 329.628].entries()) {
    const voice = own(context.createGain())
    voice.gain.value = index === 0 ? 0.05 : 0.032
    const destination = typeof context.createStereoPanner === "function" ? own(context.createStereoPanner()) : own(context.createGain())
    if ("pan" in destination) destination.pan.value = [-0.6, -0.2, 0.25, 0.6][index]
    voice.connect(destination).connect(filter)
    for (const detune of [-4, 4]) {
      const tone = oscillator(frequency, detune < 0 ? "sine" : "triangle")
      tone.detune.value = detune
      tone.connect(voice)
    }
    const breath = oscillator(0.045 + index * 0.013)
    const depth = own(context.createGain())
    depth.gain.value = 0.006
    breath.connect(depth).connect(voice.gain)
  }
  const shimmer = own(context.createGain())
  shimmer.gain.value = 0.005
  shimmer.connect(filter)
  for (const [index, frequency] of [587.33, 880, 1108.73].entries()) {
    const tone = oscillator(frequency)
    tone.detune.value = index - 1
    const envelope = own(context.createGain())
    envelope.gain.value = 0.6
    const drift = oscillator(0.06 + index * 0.017)
    const depth = own(context.createGain())
    depth.gain.value = 0.35
    drift.connect(depth).connect(envelope.gain)
    tone.connect(envelope).connect(shimmer)
  }
  for (const source of sources) source.start()

  const ease = (parameter: AudioParam, value: number, duration: number) => {
    const now = context.currentTime
    if (typeof parameter.cancelAndHoldAtTime === "function") parameter.cancelAndHoldAtTime(now)
    else {
      const current = parameter.value
      parameter.cancelScheduledValues(now)
      parameter.setValueAtTime(current, now)
    }
    parameter.setTargetAtTime(value, now, duration)
  }
  let lastPosition = -1
  let disposed = false
  return {
    setVolume(volume: number, fade = 0.3) {
      if (!disposed) ease(output.gain, Math.max(0, Math.min(1, volume)) * 0.45, fade)
    },
    position(x: number, y: number) {
      if (disposed || context.currentTime - lastPosition < 0.04) return
      lastPosition = context.currentTime
      ease(filter.frequency, 900 + Math.max(0, Math.min(1, x)) * 1200, 0.6)
      ease(shimmer.gain, 0.003 + (1 - Math.max(0, Math.min(1, y))) * 0.004, 0.8)
    },
    dispose() {
      if (disposed) return
      disposed = true
      for (const source of sources) source.stop()
      for (const node of nodes) node.disconnect()
    },
  }
}
