const { setFlagsFromString } = require('v8');
const fs = require('fs');
const execSync = require('child_process').execSync;
const path = require('path');

var dirname = __dirname.replace(/\\/g, "/");
var STLpath = path.join(__dirname,'..','STLs').replace(/\\/g, "/");
const openscad_directory = "C:/Program Files/OpenSCAD";
const shell = ["0", "1"];
const openscad_stlsuffix = ["shell", "text"];
try{
    const regextxtinput = fs.readFileSync("regex.txt", "utf8").toString().replace(/\r/g, "");
    let  done, maxtags = 0;
    let maxrules, maxsegments = 0;
    class Tags
    {
        defaulttagselector()
        {   
            let tagsarray = Array;
            let i=0;

            let regexp = /\[\/default](.+?)\[new_rule\]/sg;
            for (const match of regextxtinput.matchAll(regexp)) {
                tagsarray[i] = match[1].split("\n")
                tagsarray[i] = tagsarray[i].filter(item => item);
                i++;
            }
            return tagsarray[0];
        }
        dump()
        {   
            let tagsarray = Array;
            let i=0;
            let regexp = /\[\/new_rule\](.+?)(\[new_rule\]|\[end\]+?)/gs;
            for (const match of regextxtinput.matchAll(regexp)) {
                tagsarray[i+1] = match[1].split("\n")
                tagsarray[i+1] = tagsarray[i+1].filter(item => item);
                if(!done)
                maxsegments += 0.5;
                i++;
            }
            if(!done)
                maxsegments += 0.5;
            tagsarray[0] = this.defaulttagselector();
            return tagsarray;
            
        }

        constructor() {
            this.tags = this.dump();
        }
    }
    class Rules
    {
        defaultruleselector()
        {   
            let rulearray = Array;
            let i=0;
            let regexp = /(\[default\](.+?)\[\/default\])/gs;
            for (const match of regextxtinput.matchAll(regexp))
            {
                rulearray[i] = match[2].split("\n")
                rulearray[i] = rulearray[i].filter(item => item);
                i++;
            }
            return rulearray[0];
        }
        dump()
        {   
            let rulearray = Array;
            let i=0;
            let regexp1 = /\[new_rule\](.+?)(\[\/new_rule\]|\[end\]+?)/gs;
            for (const match of regextxtinput.matchAll(regexp1)) {
                rulearray[i+1] = match[1].split("\n")
                rulearray[i+1] = rulearray[i+1].filter(item => item);
                i++;
            }
            rulearray[0] = this.defaultruleselector();
            return rulearray;
        }
        getSegmentArgs_string(sgmnt, scope)
        {
            let argarray = new Array;
            let vardeclaration;
            for(let i=0; i<this.rules[sgmnt].length; i++)
            {
                let regexp = /(\w+)= ([0-9\.]+)/g;
                for (const match of this.rules[sgmnt][i].matchAll(regexp)) {
                    argarray[i] = (scope+match[1].toString() + " = "+match[2].toString()+";");
                }
            }
            return argarray;
        }
        setSegment(sgmnt)
        {
            this.segment = sgmnt;
        }
        init()
        {
            maxrules = 0;
            this.defaultvars = this.getSegmentArgs_string(this.segment,"this.")
            for(let i=0; i<this.defaultvars.length; i++)
            {
                eval(this.defaultvars[i]);
                maxrules++;
            }

            delete(this.rules);
            delete(this.defaultvars);
            delete(this.segment);
        }
        
        constructor() {
            this.rules = this.dump();
        }
    }

    let rules = new Rules;
    rules.setSegment(3);
    rules.init();
    let tags = new Tags;

    rules.dump();
    tags.dump();
    done = 1;

        function Export(text, ruleblock, part)
        {
            //For some reason, Linux and Windows openscad-cli -D syntax is different.
            //Linux nodejs = -D \'variable="value"\'
            //Window cmd = -D "variable=\"value\""
            //Windows nodejs = -D "variable=\\"value\\""
            //Certified dumbass parsing moment
            //this will unfortunately a regex function over and over and over and over... too bad!
            let openscadrules = new Rules;
            openscadrules.setSegment(ruleblock);
            openscadrules.init();
            let args = new Array;
            let end = (" " +dirname+'/main.scad');
            let i = 0;
            for (const key in openscadrules)
            {
                //console.log({key}+openscadrules[key]);
                args[i] = ('-D "'+key+'=\"'+ openscadrules[key] + '\""'); 
                i++;
            }
            let final = ('cd ' + openscad_directory + ' && openscad.com -q --enable textmetrics -o ' +STLpath+'/'+text+'_'+part+'.stl -D "lumbertext=\\"'+text+'\\"" -D "shell=\"'+part+'\"" '+args.toString().replaceAll(',', ' ')+' '+dirname+'/main.scad');
            //console.log('\x1b[33m%s\x1b[0m', final);
            let stdout = execSync(final, { encoding: 'utf-8', stdio: 'inherit', stdout: 'inherit'});
            return true;
        }

    console.log("MAGNETTAG STL GENERATOR\nWritten by ifp.pw \n");

    const totalstart = Date.now();
    console.log("\n ***Tag generation started***");
    let id = 0;
    for(segment=0; segment<maxsegments; segment++)
    {
        let forrules = new Rules;
        forrules.setSegment([segment]);
        forrules.init();
        console.log("Segment: " + '\x1b[32m%s\x1b[0m', segment);
        //console.log(tags.tags[segment].length);
        tags.dump();
        for(tagnumber=0; tagnumber<tags.tags[segment].length; tagnumber++)
        {
            const start = Date.now();
            tags.dump();
            console.log("ID: " + '\x1b[32m%s\x1b[0m', id++);
            for(i = 0; i < 2; i++)
            {
                tags.dump();
                Export(tags.tags[segment][tagnumber], segment, i);
                tags.dump();
            }
            const stop = Date.now();
            tags.dump();
            console.log(`Execution time: ` + `\x1b[32m%s\x1b[0m`, `${(stop - start)/1000} seconds`);
            console.log("Tag for: " + '\x1b[33m%s\x1b[0m', tags.tags[segment][tagnumber], " has been created, generating next in array\n");
        }
    }

        //linux version
        //console.log("ID: " + '\x1b[32m%s\x1b[0m', i);
        //console.log("Generating Shell STL for: " + '\x1b[33m%s\x1b[0m', jsonData.array[i]);
        //const bottom = execSync('openscad -q -D isprototype=false -D \'lumbertext="' + jsonData.array[i] + '"\' -o STLs/' + jsonData.array[i] + '_shell.stl OpenSCAD/lumbertext.scad', { encoding: 'utf-8' });
        //console.log("Generating Text STL for: " + '\x1b[33m%s\x1b[0m', jsonData.array[i]);
        //const toptext = execSync('openscad -q  -D isprototype=false -D \'lumbertext="' + jsonData.array[i] + '"\' -o STLs/' + jsonData.array[i] + '_text.stl OpenSCAD/lumbertexttop.scad', { encoding: 'utf-8' });
        //const stop = Date.now();
        //console.log(`Execution time: ` + `\x1b[32m%s\x1b[0m`, `${(stop - start)/1000} seconds`);
        //console.log("Tag for: " + '\x1b[33m%s\x1b[0m', jsonData.array[i], " has been created, generating next in array\n");
    const totalstop = Date.now();
    console.log("Amount of tags created: " + '\x1b[32m%s\x1b[0m', 10);
    console.log("Total execution time: "  + '\x1b[32m%s\x1b[0m', `${(totalstop - totalstart)/1000} seconds`);
    console.log("***No more tag sizes, exiting***");
}
catch(err)
{
    console.log(err);
}