import './Tasks.css'
const Task = ({data, onDelete, id, onComplete}) => {
    let hrsLeft = parseInt((new Date(data.timestamp + data.duration).getTime() - new Date().getTime())/3600000);
    let minsLeft = Math.ceil((((new Date(data.timestamp + data.duration).getTime() - new Date().getTime())/3600000) - hrsLeft)*60);
    return (
        <div id={`task-${id}`} className="Task tsk">
            <div className="Status">
                <input onClick={() => {onComplete(id)}} className="Checkbox" type="checkbox"/>
            </div>
            <div className="info">
                <h2>{data.title}</h2>
                <h3>{data.description}</h3>
                <p className="time">
                    <span id="hours">{(hrsLeft) != 0? `${hrsLeft} hours ` : ``}</span>
                    <span id="minutes">{minsLeft} minutes left</span>
                </p>
            </div>
            <div className="options">
                <div className="del">
                    <svg id="delete-btn" onClick={() => {onDelete(data.id);}} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="gray" className="bi bi-trash del-icon" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default Task;