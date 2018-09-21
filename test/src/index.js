import styles from './styles.css';
import styles2 from './styles2.css';

console.log(styles,styles2);

const el = document.querySelector('.test')
if (el) {
    el.classList.add(styles.test);
}