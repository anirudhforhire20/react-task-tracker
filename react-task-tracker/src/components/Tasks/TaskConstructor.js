import './Tasks.css'
import { useState } from 'react';
const TaskConstructor = ({onDelete, onCreate}) => {
    return (
        <div className="Task TaskConstructor">
            <div className="Status">
                <input className="Checkbox" type="checkbox"/>
            </div>
            <div className="info">
                <input id="title" placeholder="Title" type="text"/>
                <input id="description" placeholder="Description" type="text"/>
                <p className="time">
                    <select id="time">
                        <option value={5*60000}>5 minutes</option>
                        <option value={10*60000}>10 minutes</option>
                        <option value={30*60000}>30 minutes</option>
                        <option value={60*60000}>60 minutes</option>
                        <option value={2*60*60000}>2 hours</option>
                        <option value={6*60*60000}>6 hour</option>
                    </select>
                </p>
            </div>
            <div className="options">
                <div>
                    <svg onClick={() => {
                        const data = {
                            title : document.querySelector('.TaskConstructor #title').value,
                            description : document.querySelector('.TaskConstructor #description').value,
                            duration : parseInt(document.querySelector('.TaskConstructor #time').value)
                        };
                        onCreate(data);
                    }} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="gray" class="bi bi-plus-square-fill add" viewBox="0 0 16 16">
                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
                    </svg>
                </div>
                <div className="del">
                    <svg onClick={() => {onDelete();}} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="gray" class="bi bi-trash del-icon" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default TaskConstructor;