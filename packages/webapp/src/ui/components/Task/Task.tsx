import { FC } from 'react';

interface TaskProps {
    id: string | null | undefined
    title: string | undefined
    updatedAt: Date | null | undefined
    state: 'TASK_INBOX' | 'TASK_PINNED' | 'TASK_ARCHIVED'
}

type StoryProps = {
 task: TaskProps | undefined | null
 onArchiveTask: (id: string | undefined | null) => string | undefined | null
 onPinTask: (id: string | undefined | null) => string | undefined | null
}
  
export const Task:FC<StoryProps> = ({task, onArchiveTask, onPinTask}) => {
    if(!task || !onArchiveTask || !onPinTask ){
    return null
    }
    const {id, title, state} = task
    return (
        <div className={`list-item ${state}`}>
            <label className="checkbox">
            <input
                type="checkbox"
                defaultChecked={state === 'TASK_ARCHIVED'}
                disabled={true}
                name="checked"
            />
            <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
            </label>
            <div className="title">
            <input type="text" value={title} readOnly={true} placeholder="Input title" />
            </div>

            <div className="actions" onClick={event => event.stopPropagation()}>
            {state !== 'TASK_ARCHIVED' && (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a onClick={() => onPinTask(id)}>
                <span className={`icon-star`} />
                </a>
            )}
            </div>
        </div>
    );
}