import {useShortcuts} from '../../contexts/shortcuts';
import styles from './Footer.module.scss';

export function Footer() {
  const {shortcuts, currentModule} = useShortcuts();
  return (
    <div className={styles.root}>
      {shortcuts[currentModule].map(({key, action}, index, arr) => (
        <div>
          <span className={styles.key}>{key}</span>
          <span className={styles.action}>{action}</span>
          {index < arr.length - 1}
        </div>
      ))}
    </div>
  );
}
