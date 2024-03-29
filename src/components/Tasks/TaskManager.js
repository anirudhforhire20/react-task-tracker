import React, { useState } from 'react';
import Task from './Task'
import TaskConstructor from './TaskConstructor';


//tasks manager class
class taskSync {
    constructor() {
        this.offset = 0;
        this.tasks = [];
        this.updateState = true;
        // this.db = getFirestore(app);
    }
    get(callback)
    {
        // getDocs(collection(this.db, "tasks"))
        // .then(snapshot => {
        //     this.tasks = snapshot.docs.map(e => e.data());
        //     if(this.tasks.length > 0)
        //         this.offset = this.tasks[this.tasks.length - 1].id;
        //     callback();
        // })
    }
    addTask(title, description, duration)
    {
        let data = {
            id : this.offset++,
            title : title,
            description : description,
            timestamp : new Date().getTime(),
            duration : duration,
            status : 'pending',
        }
        this.tasks.push(data);
    }
    remTask(id)
    {
        let tsk = this.tasks.filter(task => task.id == id)[0];
        this.tasks = this.tasks.filter(task => task.id != id);
    }
    completeTask(id)
    {
        this.remTask(id)
    }
}

let tm = new taskSync();

var inSync = false;
const TaskManager = () => {

    var [tasks, getsetTasks] = useState(tm.tasks);

    const onComplete = (id) => {
        tm.completeTask(id);
        tasks = tm.tasks;
        getsetTasks(tasks);
    }

    //For deleting tasks
    const onDelete = (id) => {
        tm.remTask(id);
        tasks = tm.tasks;
        getsetTasks(tasks);
    }



    //for adding tasks
    const addTask = (data) => {
        tm.addTask(data.title, data.description, data.duration);
        tasks = tm.tasks;
        getsetTasks(tasks);
        onConstructorDelete();
    }





    //taskConstructor manager
    let [taskConstructor, taskConstructorManager] = useState(false);
    const onConstructorDelete = () => {
        taskConstructorManager(false);
    }


    // if(!inSync)
    // {
    //     inSync = true;
    //     tm.get(() => {
    //         tasks = tm.tasks;
    //         getsetTasks(tasks);
    //         onConstructorDelete();
    //         console.log(tasks, tm.offset)
    //     })
    // }



    //rendering tasks
    return (
        <div className="TaskManager">
            <header>
                <h1 className="Heading">Pending tasks</h1>
            </header>
            {tasks.map((task) => (
                <Task key={task.id} id={task.id} data={task} onDelete={onDelete} onComplete={onComplete}/>
            ))}

            {/*Calling task constructor if taskConstructor is true */}
            {taskConstructor? (<TaskConstructor onDelete={onConstructorDelete} onCreate={addTask}/>) : (
                <div onClick={() => {
                    //setting toggle for task constructor
                    taskConstructorManager(true);
                }} className="AddTask">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16">
                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
                    </svg>
                    <h2>New task</h2>
                </div>
            ) }

            {/*Adding a prompt if no task constructor and list is empty */}
            {tasks.length == 0 && !taskConstructor? (<p className="prompt">No pending tasks</p>) : undefined}
        </div>
    );
}


// Here's a very unconventional way to update time
//This is used because REACT SUCKS!!!
//Time is updated directly in HTML DOM
//react states and task sync doesn't need to change for this update
//this one is for hours
let hours = 1;
let minutes = 1;
let hid = setInterval(() => {
        document.querySelectorAll('.Task.tsk').forEach(el => {
            hours = parseInt(el.querySelector('#hours').innerHTML.split(' ')[0]);
            console.log(hours)
            if(hours == undefined || hours == NaN || hours == '' || hours <= 0)
            {
                //don't show hours
                hours = 0;
                console.log(el.querySelector('#hours').innerHTML);
                el.querySelector('#hours').innerHTML = '';
            }
            else
            {
                el.querySelector('#hours').innerHTML = `${hours - 1} hours `;
            }
        });
},1000*3600)

let mid = setInterval(() => {
    document.querySelectorAll('.Task.tsk').forEach(el => {
        minutes = parseInt(el.querySelector('#minutes').innerHTML.split(' ')[0]);
        console.log(minutes);
        if(minutes == undefined || minutes == '' || minutes <= 0)
        {
            if(hours <= 0)
            {
                //sync with backend
            }
            else
            {
                el.querySelector('#minutes').innerHTML = `${59} minutes left`;
            }
        }
        else
        {
            el.querySelector('#minutes').innerHTML = `${minutes - 1} minutes left `;
        }
    });
    if(tm.tasks)
    {
        tm.tasks.forEach(task => {
            if(task.timestamp + task.duration <= new Date().getTime())
            {
                //document.querySelector(`#task-${task.id}`).remove();
            }
        })
    }
    console.log('updating time');
},1000*60)


export {TaskManager, tm};