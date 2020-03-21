# Meanderer

A solution to responsive CSS motion path.

Detailed in this post on CSS Tricks!

1. Draw a path
2. Export the SVG
3. Grab the path, height, and width
4. Create a new reponsive motion path with `new Meanderer`
5. Invoked the `scale` function on container resize. Either use `ResizeObserver` or `resize` or whatever other method you like

Enjoy responsive CSS motion path.

Container aspect ratio needs to match that of 112.748 to 241.22
So what is 112.748 / 241.22? 0.46740735... But we can do this in CSS
width: calc((112.748 / 241.22) * 40vmin) 👍

# Maintaining aspect ratio
