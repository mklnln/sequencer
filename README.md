# Simple Sequencer

# What's a sequencer?
A music sequencer plays pre-determined notes over an interval of time and uses a sort of grid to do so. Along the x-axis, there are different columns that each represent a beat, i.e. a musical slice of time. Along the y-axis, there are different rows that each represent different notes of the major scale. Click various notes and then hit the start/stop button (shortcut: s) to hear them played back. Change the sounds to different synthesizer waveforms or use the loaded samples. 

# Why make this?
The intention was to create a visual representation of the notes of the major scale and the corresponding chords. Playing just these notes makes it easier for beginners to play something that "sounds good" and inspires more music making. I really want more people to discover the joy of making music!

# Technologies Used
Hosted on Render and made with React, the core functionality of the sequencer works entirely client-side. 

### The Web Audio API is the real star of the show.


# MVP
As outlined in my project proposal, the *minimum viable product* was to log in via Auth0, save/load songs and settings in MongoDB, visualize chord probability from the HookTheory API, and play sounds based off the sequencer grid. 

I was able to go a bit further, delving into some intricacies of the Web Audio API (different synthesizer parameters, volume, etc) and featuring both chords and melody grids for sound.

Please note that this is an MVP and still contains bugs. I hope you'll find something interesting in it! I'd be happy to show you around the code if you find yourself curious about it. 

# To-do list:
- [x] Playback sound
- [x] Create grid with selectable buttons using React
- [x] Integrate chord suggestions from the HookTheory API (needs BE)
- [x] Allow users to save and reload songs (needs BE)
- [x] Allow for manipulation of the Web Audio API synth engine (cutoff, attack, decay, etc)
- [x] Select different sounds, some of which are sampled from a single mp3 and pitch-shifted to create different notes
- [ ] Get back-end (BE) live
- [ ] Integrate rock-solid timing by co-ordinating Web Audio's current time with a lookahead note scheduling algorithm
- [ ] Get tempo to reflect real BPM values (currently just approximate)
- [ ] Fix bugs with parameter manipulation, especially when the values are set to extremes (ADSR, tempo, filter, etc)
- [ ] Design UI with inspiration from real-world synth hardware using Figma
- [ ] Create ? icons with corresponding modals to teach the user about both the sequencer and music theory.
- [ ] Finishing touches (tab icon, tab title, song pre-loaded, UX decisions, etc)
