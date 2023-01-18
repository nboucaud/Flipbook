import styles from './Console.module.scss';

import {openFileInEditor, StackTraceEntry} from '../../utils';
import clsx from 'clsx';

export interface StackTraceProps {
  entries: StackTraceEntry[];
}

export function StackTrace({entries}: StackTraceProps) {
  return (
    <div className={styles.stack}>
      {entries.map(entry => (
        <div
          className={clsx(styles.entry, entry.isExternal && styles.external)}
        >
          at (
          {entry.isExternal ? (
            `${entry.file}:${entry.line}:${entry.column}`
          ) : (
            <button
              className={styles.link}
              onClick={() => openFileInEditor(entry)}
            >
              {entry.file}:{entry.line}:{entry.column}
            </button>
          )}
          )
        </div>
      ))}
    </div>
  );
}
