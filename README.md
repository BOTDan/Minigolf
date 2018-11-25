# Minigolf (Arcade API)
## What is it?
This is a 2D minigolf arcade game created using JavaScript to run on the Arcade API (not a web-browser). It has it's own UI system build completely from scratch and a level editor and tester. 
## What does it contain?
- GameBase - a module I created to ease the process of making things within the API. This includes:
	- Basic **text rendering** and font support (using a text spritesheet)
	- UI elements with click, hover and drag support.
	- Draw and click ordering, so elements can be placed atop each-other.
	- **Buttons** with hover events and callbacks
	- **Text entries** with text selection and modification
	- **Number entries** with automatic validation
	- **Cursor rendering** with different types of cursors
	- **Dropdown** elements with automatic closing
	- **Scroll boxes** with automatic resizing
	- **Console** system
- Box2D (a 2D physics engine) written in JS. I didn't write this, but I don't remember the author. *I decided to retire my own 2D physics.*
- Minigolf level editor. Accessible by pressing `¬` and typing `leveledit`. The level editor contains:
	- Automatically connecting grass blocks
	- Ball pushers
	- Moving platforms (in dev)
## How do I play?
1. Download the Arcade API from [here](https://forums.pixeltailgames.com/t/arcade-tool-for-people-who-want-to-mess-with-it/23715?u=botdan). Download the one that supports JavaScript at the bottom of the post, otherwise this won't work.
2. Unpack the folder and save it somewhere
3. Create a new folder inside the `projects` folder called `gamebase`.
4. Place the contents of this repository into the `gamebase` folder. You should have a file structure like so: `PATH_TO_ARCADE/projects/gamebase/main.js`
5. Open a command prompt inside the arcade api root folder (where you can see the `projects` folder and `tool.exe`)
6. Type `tool gamebase`.
And voila, you're done. You can open the level editor using `¬` and typing `leveledit`. There's currently no gameplay aside from the editor.
