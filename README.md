#Node demo: Speak up

This node module (in progress) accepts a client request with input text (given by user in the Url) 
and turns it into spoken language by creating an audiofile.
The response to this request is an audio element in the HTML body of the text that could be played.

The two significant calls are in the following form:

1. localhost:4000/say/This is a text I would like to hear back
2. localhost:4000/play/filename_<randomnumber>.wav

This is work in progress. Following up TODOs:
----------------------------------------------
1. sanitize input from "/say/"
2. create the audio file extensions to support browsers other than Safari (the current extension is wave)
3. etc.