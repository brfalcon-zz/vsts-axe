#Overview
This tasks use aXe rules to perform accessebility validation in the Release Pipeline using Visual Studio Team Services or Team Foundation Server.

#How to Install this Task
1.Clone this repo 
2.Open a command prompt and navigate to the repo root
3.Install npm pacages
`npm install
4.Upload task to TFS or VSTS
`tfx login
`tfx build tasks upload --task-path .   

#Requirements
* [Node.js](https://nodejs.org/)
* [tfx-cli](https://github.com/Microsoft/tfs-cli) 