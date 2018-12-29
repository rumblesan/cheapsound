
import midi
import (a4, c#5) from note
midi.open(0)

print(midi.getPorts())

n = note.duration(a4, 8)

midi.play(n)

midi.play(note.duration(c#5, 3))

