Move-Bot
========

Organise your files with a simple JSON file!

The guide below is an example of what it will soon be like to use, Implementation is not done yet!

## Installation
Make sure you have node installed and then run
```Shell
sudo npm install -g movebot
```
## Usage

Using MoveBot is very simple, Just write your Sorting Schema ( See configuration )
and then run movebot with your file as one of the arguments.

```
    movebot your-sorting-schema.json
```
This will organise your current directory using your-sorting-schema.json

## Configuration

Movebot only needs a json file to run, in this json file simply specify all the 'rules' you want as keys (Using regular expressions) and then where you want them to go a values

```JSON
{
	".*\.txt" : "Docs/Text/"
	"awesome.docx" : "Docs/Awesome/"
	"__ELSE__" : "Other/"
}
```
If the files used are
```
hi.txt
test.txt
awesome.docx
other.md
```
This will result in the following directory structure
```
Docs/
  Text/
    hi.txt
	test.txt
  Awesome/
    awesome.docx
Other/
  other.md
```
## Other options
#####--dry
Only shows how the directory would be but doesn't move anything. Useful for testing