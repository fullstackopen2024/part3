import '../styles.css'

const Notification = ({notification}) => {
    return (
        <div className={notification.type === 'error' ? 'notification error' : 'notification success'}>
            {notification.message}
        </div>
    )
}

export default Notification;