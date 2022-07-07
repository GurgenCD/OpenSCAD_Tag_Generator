
OpenSCAD_Tag_Generator is a project written from scratch to showcase my capabilities of automation with use of OpenSCAD, Conventional CAD software, JavaScript, and Regex.

![image](https://user-images.githubusercontent.com/23152510/177714079-c328457a-4d9c-44cd-9543-13c583cbb3b0.png)

# What is the point?
The idea of this project is to completely automate the creation of alphanumerical identification engraved into predefined mesh files. This could create a lot of possibilities that were previously never explored.

# How does it work?
## OpenSCAD
The function of the program starts in the OpenSCAD script.
The script first declares all of the functions used in manipulating text:

    lumbertext = "510";
    shell = 0;
    characterspacing = 1;
    scalevalz = 1.3;
    fontsize = 30;
    xoffset = -1;
  These are the default variables declared at the start of the script, which are meant to be overwritten using my JavaScript program and the commandline argument capabilities of OpenSCAD
  
  The script then goes on to figure out, using the variables above, how long the text will be in milimeters. Using that information, the script will decide which flat surfaced "tag" mesh file it wille use (either 104mm, or 74mm).

Afterwards, the script will take the variable named **lumbertext**, and use its' value to make a negative extrusion into the tag mesh file. The script will then generate an STL file of the tag mesh file, with carved out text in it.
Following up, the script is meant to be run twice, with the exception of changing the **shell** variable value from **0** to **1**. This change results in the script not importing the tag mesh file, and instead just extruding text.

## JavaScript

### Interpreter part
The function of the JS script in this case is using Regular Expressions-- create an interpreter of a instruction file with my own made up syntax:

    [new_rule]
    characterspacing= 0.85
    scalevalz= 1.3
    fontsize= 25
    [/new_rule]
    GL10
    cook
    
    [new_rule]
    characterspacing= 1.5
    scalevalz= 1.5
    fontsize= 10
    [/new_rule]
    TestingSecond
    123

The JS script takes this information, and using regular expression creates two arrays:

 #### 1. Rule segment array- this array is a set of rules of only one segment at a time, which can be redeclared using setSegment(num of the segment) function.
 
For example:

    let  rules = new  Rules;
    rules.setSegment(1);
    rules.init();
    rules.dump();
    console.log(rules);
    
 This results in console output of:
 
    Rules {characterspacing: 1.5, scalevalz: 1.5, fontsize: 10}



 #### 2. Tag name segment array- this  nested array declares an inner array for each segment of the instruction file
 
 For example:

    let  tags = new  Tags;
    tags.dump();
    console.log(tags);
   Results in a console output of:
   

     Tags {
      tags: [Function: Array] {
        '0': [ 'GL10', 'cook' ],
        '1': [ 'TestingSecond', '123' ]
      }
    }

### Commandline command generation:
Using OpenSCAD's ability to override declared variables outside of the file using commandline arguments, I created **Export()** function that given the text, number of the rule segment, and **Shell** variable value of **0** or **1** constructs a command which is sent to the windows cmd (I could very easily make it workable on linux terminal, but didn't feel the need after switching).

The **Export()** function is called twice per each tag text declared in the instruction file using 3 for loops: once for the mesh file with carved out text, and one with text extrusions completely separate. and uhhh, that's about as much as there is to the program I guess?
