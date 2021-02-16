# UK Singles Chart: Number 1s

## Table of Contents

 * [Explanation](#explanation)
 * [Live Version](#live-version)
 * [Compatibility](#compatibility)
 * [Testing](#testing) 
 * [File Descriptions](#file-descriptions)
 * [Technologies](#technologies)
 * [Validation](#validation)
 
## Explanation

The UK Singles Chart tracks the sales of music in the United Kingdom.

This interactive webpage allows you to explore the songs that have reached Number 1 on the chart.

## Live Version

https://robson.plus/number-1s/

## Compatibility

The output for this project is designed for desktop only. Mobile is not supported.

| Platform | OS      | Browser          | Version | Status  |
| :------- | :------ | :--------------- | :------ | :------ |
| Desktop  | Windows | Firefox          | 85      | Working |
| Desktop  | Windows | Opera            | 74      | Working |
| Desktop  | Windows | Chrome           | 88      | Working |
| Desktop  | Windows | Edge             | 88      | Working |

Last tested on 16th February 2021.

## Testing

The repository has two things: a Python script to get the data and a webpage to view it.

### Python

The instructions for running this are contained within *converter.py*

### Webpage

To run this on your computer:
 * [Download the repository](https://github.com/Robson/Film-Franchise-Ratings/archive/master.zip).
 * Unzip anywhere.
 * Open *index.html* in your browser.

## File Descriptions

### converter.py
This python script is responsible for converting the data from Wikipedia into JSON. There's lots of information and instructions in that file.

### data.json
This is created by the script above.

### index.html + style.css + page.js
These are responsible for visualising the data as an interactive webpage.

## Technologies

This is built using:
 * Python
 * HTML
 * CSS
 * JavaScript
   * <a href="https://github.com/jquery/jquery">jQuery</a>
     * <a href="https://github.com/calebjacob/tooltipster">Tooltipster</a>

## Validation
	 
<a href="https://validator.w3.org/nu/?doc=https%3A%2F%2Frobson.plus%2Fnumber-1s%2F"><img src="https://www.w3.org/Icons/valid-html401-blue" alt="Valid HTML" /></a>
<a href="https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Frobson.plus%2Fnumber-1s%2Fstyle.css&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en"><img src="https://jigsaw.w3.org/css-validator/images/vcss-blue" alt="Valid CSS" /></a>   	 