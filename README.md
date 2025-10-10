# Lead Management CRM

A full-stack task management app with user authentication to manage tasks, teams & projects.  
Built with a React frontend, JWT for authentication, Express/Node backend & MongoDB database.

---

## Demo Link

[Live Demo](https://workasana-frontend-mocha.vercel.app/)  

---


## Quick Start

```
git clone https://github.com/MrinalSisodia/Workasana-Frontend.git
cd <Workasana-Frontend>
npm install
npm run dev
```

## Technologies
- React JS
- React Router
- Node.js
- Express
- MongoDB
- JWT

## Demo Video
Watch a walkthrough of all major features of this app:
[Youtube Video Link](https://youtu.be/FMJTVOlwCSw)

## Features
**Dashboard**
- Displays all projects
- Displays user specific tasks with filter by status functionality.

**Sidebar**
- Quick navigation from any page to Dashboard, Teams, Reports, Settings.

**Project Management**
- Navigate from dashboard project list to a specific project
- Lists all tasks for a project
- “Add New Task” button opens a form
- Sort tasks by priority, due date & filter by owner.


**Task Management**
- View full task information (team, owner, status, priority, due date)
- “Edit Task” opens a form to update any field for the task 
- "Mark as Complete" updates status to completed

**Teams**
- View list of all teams
- "New Team" opens form to add a new team
- Each team card can be clicked to view & update the team members


**Settings**
- View user details
- "Logout" navigates back to login page
- Delete tasks & teams

**Reports** 
- Reporting charts for quick visualization of data
- Closed tasks in last 7 days
- Total Work Pending (estimated days) per project 
- Tasks Closed grouped by- Team/Owner/Project


## API Reference 
- api - https://workasana-backend-liard.vercel.app/api

**All routes need token from user login**
- User - alice@example.com
- Password - secret123

### **GET	/api/tasks**<br>	 
List all tasks by owner<br>	 
Sample Response:<br>
```[{_id, name, project, team, owner:[{"_id","name"}, ...], status, tags:[], timeToClose, priority}, …]```

### **GET	/api/projects**<br>	 	
Get all projects<br>		
Sample Response:<br>
```[{_id, name, description}, ...]```

### **GET	/api/teams**<br>	 
List all teams<br>	 
Sample Response:<br>
``` [{_id, name, description, members}, ...]```

### **POST	/api/auth/signup**<br> 	
Register a new user<br>

### **POST	/api/tasks**<br> 	
Create a new task<br>	

### **POST	/api/teams**<br>  	
Add a new team<br> 	

### **GET	/api/reports**<br>	 
List reports with /tasks/closed-last-week OR  /tasks/pending-summary OR /tasks/closed-by-group <br>	 
Sample Response:<br>
```{labels: [..], data: [..]} ```



## Contact
For bugs or feature requests, please reach out to mrinalsisodia28@gmail.com