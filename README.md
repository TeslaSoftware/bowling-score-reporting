# BowlingScoreReporting

## Project overview

### Functionality 

This application allows user to upload a text file contianing player names and their respective bowling scores. The application will validate file and its formate and either display helpful error message to the user or display parsed scores in form of a sortable table with pagination. 

### Expected input

This application expects input in form of a file with `txt` extension. The file should contain even number of lines. Each odd line should contain player name and next (even) line should contain player scores separated by commas `,`. There should be minimum of `20` scores and maximum of `22` scores as per bowling game rules (see [Game rules](#game-rules) section).

Example input:

    John Doe
    1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2
    James Blonde
    9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9
    Jill Buzz
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4

Please note that if player scores strike in a frame the second roll of that frame should be marked as `0` for consistent parsing (even though second roll did not actually happen).

In addition, you can find example (valid and invalid) input files in the directory `test-files`.

### Game rules

The game consists of 10 frames (plus possible bonus frame), where each frame has two rolls (except possible bonus frame which can have either one or two rolls).

One point is scored for each pin that is knocked over, and when fewer than all ten pins are knocked down in two rolls in a frame (an open frame), the frame is scored with the total number of pins knocked down. 
However, when all ten pins are knocked down with either the first or second rolls of a frame, bonus pins are awarded as follows:

* Strike: When all ten pins are knocked down on the first roll, the frame receives ten pins plus a bonus of pinfall on the next two rolls (not necessarily the next two frames). A strike in the tenth (final) frame receives bonus frame with two rolls.

* Spare: When a second roll of a frame is needed to knock down all ten pins, the frame receives ten pins plus a bonus of pinfall in the next roll (not necessarily the next frame). A spare in the first two rolls in the tenth (final) frame receives a bonus frame with one roll.

The maximum score is 300, achieved by getting twelve strikes in a row within the same game (known as a perfect game).

## Development

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Angular CLI help

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.2.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Tests

## Running unit tests

Unit test are currently not impleented. Sorry! 
One day I will implement them. Once this is done they will be runnable via `ng test`. 
Unit tests will execute via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

E2E test are currently not impleented. Sorry! 
Once they will be implemented we will be able to enter in command line `ng e2e` to execute the end-to-end tests via a platform of our choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.


