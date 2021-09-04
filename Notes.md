Import three.js for dev or three.min.js for prod
Set up scene, camera and renderer

BoxGeometry
    - contains all the points and fill (faces)
Mesh 
    - takes a geometry, and applies a material to it,
    - can insert to our scene, and move freely around

scene.add() adds to the coordinates (0,0,0)

each mesh object has a rotation variable in it whose x, y, z can be set to define the rotation in those axeses