"""This song's files and stems, in one place for every analysis script."""
TITLE = "Nine Hundred Acres (The Hum)"
SUNO_TITLE = "Field of Humming Things"  # Suno's name for the take; the video uses TITLE
TRACK = f"audio/track/{SUNO_TITLE}.wav"  # the Suno mix (16-bit); timing is built on it
MASTER = "audio/master/field-of-humming-things.no-fallback.wav"  # the post-filtered master the video uses (24-bit)
STEM = "audio/stems/{}.wav"
STEMS = ["0 Lead Vocals", "1 Backing Vocals", "2 Drums", "3 Bass", "4 Guitar", "5 Keyboard", "6 Percussion", "7 Synth",
         "8 Other"]
