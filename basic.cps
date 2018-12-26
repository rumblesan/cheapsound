
print(1)

import midi
import chords as ch

import (c1, a1, d1, g1) from Notes


// output midi to channel 0
obx1 = midi.out(0)

// output midi to channel 1
obx2 = midi.out(1)

// create a list of notes with velocity of 40%
rootNotes = map(
  (n)=>velocity(n, 0.4),
  [
    note(c1),
    note(a1),
    note(d1),
    note(g1)
  ]
)

// 30%chance to play the next root note every half beat 
seq1 = every(
  0.5,
  chance(0.3, next(rootNotes))
)

// take a note, add a random number to it, then use
// it as the root of a major chord
chords = (n) => chord(
  noteplus(n,
    choose([0, 3, 8])
  ),
  ch.maj
)

// use the chords function to modify values sent to the obx1 output
chordsChannel = chain(seq, chords, obx1)

// select one of the notes in the incoming chord and create another note
// one octave up and delayed by quarter of a beat
lead = (ch) => {
  r = oneof(ch)
  combine(r, delay(0.25, octaveplus(r, 1)))
}

// create the output of the lead notes to the obx2 output
leadChannel = chain(seq, (n)=>octaveplus(n, 1), chords, lead, obx2)

delete(chordsChannel)

