# pen-case :pencil:

A local development boilerplate set up for CodePen with _"POST to Codepen"_ built-in!

Based off of my personal preference for pens. Therefore using Stylus(w/ autoprefixer), Jade and Babel.

## Why
Because I'm not always online, but I want a quick and easy way to work on pens locally and then simply push them up to CodePen later. Plus, it's nice to have them all in version control.

## Basic example
```shell
make create PEN=NewPen
make deploy PEN=NewPen
```

## Usage
The boilerplate is put together using `Make` with a self-documented `Makefile`.

1. Clone the repo!
```shell
git clone https://github.com/jh3y/pen-case.git
```
2. Navigate into the repo and run `make` to see available tasks
```shell
cd pen-case
make
```
To start work on a new pen or run a particular task for a pen, you must always define the `PEN` variable for `Make`. For example;
```shell
make compile-markup PEN=SuperPen
make create PEN=loader
make deploy PEN=spinner
make develop PEN=contact-card
```

## How
Using the information about ["POST to prefill editors"](https://blog.codepen.io/documentation/api/prefill/) over on [Codepen](http://codepen.io), I thought about ways to dynamically generate the required form and markup using templating and have it automatically open and submit the form.

## Issues/Contributing
As always, any suggestions or contributions, feel free to raise an issue or tweet me [@_jh3y](twitter.com/_jh3y) :smile:


Made with :heart: by [@jh3y](twitter.com/@_jh3y) 2016
