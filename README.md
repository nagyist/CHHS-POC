# Oliver Wyman - CHHS - Proof of Concept

Prototype URL: [https://protected-temple-25733.herokuapp.com](https://protected-temple-25733.herokuapp.com/)

Developed for CHHS RFI-75001

This project is licensed under the terms of the GPLv3 license.

Key features include:

* Login
* Private messaging
* Profile creation
* Mapping of foster facilities

## Approach Overview

The following is a summary of the approach used by Oliver Wyman Labs to create the working prototype. Please see “Oliver Wyman RFI-75001 Technical Approach Documentation and Design Assets.pdf” in the "documentation" folder for comprehensive documentation of the approach and requirements, including screenshots and detailed notes. 

Oliver Wyman Labs applies innovative approaches to technology to drive business impact for our clients. The mission of Oliver Wyman Labs is to help clients unleash the power of information they already have or could capture, and through that, drive competitive advantage and sustained impact. Oliver Wyman Labs uses agile development principles to collaboratively evolve solutions through development and delivery with continuous, incremental improvements via rapid and flexible iterations.

The Oliver Wyman Labs team utilized human-centered design techniques to create the prototype design and improve the user experience. The team worked collaboratively to develop multiple iterations of the prototype with continuous planning, testing and integration, while incorporating feedback from usability testing.

### Project organization: 

* A multi-disciplinary and collaborative team was assembled to design and complete the prototype, including a Product Manager, Project Leader, Delivery Manager, Frontend Developers, User Researcher, Backend Developers, and a DevOps Engineer. Profiles of all team members are provided in the appendix of the documentation PDF.
* After planning the design approach and technical requirements, the team conducted three one-week sprint cycles to complete development and testing.

### Human-centered design approach:

Four human-centered design techniques were used: Interviews, secondary research, storyboarding, and usability testing. People were included throughout the design process, with their feedback incorporated into multiple iterations of the prototype.

1. Three interviews were conducted with a social worker and parents to gain insight into  foster care management and parents’ concerns while designing the tool.

2. The team conducted secondary research by reviewing examples of tool features to identify strengths and weaknesses and apply learnings to the prototype design. The team also researched foster care management to shape the content of the prototype, including case planning details.

3. Initial mockups of tool features were created before storyboarding examples of user scenarios to refine the design.

4. Two usability testing sessions were held one week apart with five participants to evaluate the users’ ability to navigate to different pages and easily understand the information presented. Participants were given prompts to complete using the tool, while the team collected metrics and qualitative feedback.

Design style guide: Bootstrap was used as the library for the front-end framework to ensure a responsive and mobile-first design. Style guide can be found at http://getbootstrap.com/ and comprehensive design specifications can be found in “core.css” in the repository.

### Agile development approach:

The team conducted three one-week sprint cycles to complete development and testing. Several technologies were used to ensure the prototype works on multiple devices with a responsive design, including Bootstrap, Knockout, and Node.js. All platforms used to create and run the prototype are openly licensed and free of charge.

* Modern and open-source technologies include: Docker, Jenkins, MongoDB, Node.js and Knockout.
* Platform as a Service (PaaS) provider: Heroku
* Automated unit tests developed via: Mocha/Chai
* Continuous integration system: Jenkins
* Configuration management: git
* Continuous monitoring: New Relic
* Container deployment: Docker

A node.js-based application architecture was used, supported by a carefully selected set of modern frameworks. The application development work was based on a beta version of an in-house framework that prescribes specific approaches to common problems to speed up development.

Project management tools used include JIRA, HipChat, Bitbucket, and Confluence. The team used JIRA to create a prioritized list of features selected for development and track bugs and issues.

## Run application locally for development

### Local installation with Docker

Download Docker Toolkit

Edit docker-compose.yml to point to the repository location. Don't change anything after the `:` as this defines the mount point on the docker VM (e.g. if the code is checked out in `/Users/me/Work/Projects/chhs/` then this line should read `/Users/me/Work/Projects/chhs:/home/node/koe`)

In a terminal, 

* `cd your/repo/directory`
* `docker-machine start`  --> This needs only to be done once
* `eval $(docker-machine env)`  --> This should be done in every new terminal you open
* `docker-compose up` --> This creates a web container and mongodb container, and launches the page itself on port 9001

To interact with your containers (example: repo_web_1), open up a new terminal

* `eval $(docker-machine env)`
* `docker exec -ti repo_web_1 bash`

### Local installation

1. Download and install Node ^4.0 and NPM ^3.0
2. If you don't have grunt-cli installed yet, run `npm install -g grunt-cli` (this installs it "globally" for your user, type "grunt" from any command window)
3. Clone repository to local directory
4. In the directory where you checked out the repo, run `npm install`
5. Run `grunt dev` to launch the page

## Heroku hosting

The app is hosted on Heroku at [https://protected-temple-25733.herokuapp.com](https://protected-temple-25733.herokuapp.com). The app is currently set up to use a mLab MongoDB sandbox, which is linked from the app page in Heroku.

A number of environment variables have been set in the Heroku settings page, specifically:

 * NODE_ENV
 * NEW_RELIC_APP_NAME
 * NEW_RELIC_LICENSE_KEY
 * MONGODB_URI

These automatically overwrite the corresponding values in the application default config, and would need to be updated accordingly for deployment to other environments.

## Licensing
Copyright (C) 2016 Oliver Wyman, Inc.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version. 

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA

## Questions?

Contact [Ed Olson-Morgan](mailto:Edmund.Olson-Morgan@oliverwyman.com).