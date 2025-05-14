import styles from '../styles/Grid.module.css'
import { UserItemResponse } from '../types/item'

import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CreateIcon from '@mui/icons-material/AddCircle'

interface GridProps {
  title: string
  data: UserItemResponse[]
}

export const Grid = (gridProps: GridProps) => {
  return (
    <>
      <div className={styles.searchPagination}>
        <h2>{gridProps.title}</h2>
        <input type="search" id="search" placeholder="Search..." aria-label="Search" />
        <button>
          <CreateIcon />
        </button>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {gridProps.data.map((item: UserItemResponse) => (
              <tr>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.status}</td>
                <td class="actions">
                  <span class="material-icons">
                    <a href="#">
                      <VisibilityIcon />
                    </a>
                  </span>
                  <span class="material-icons">
                    <a href="#">
                      <EditIcon />
                    </a>
                  </span>
                  <span class="material-icons">
                    <a href="#">
                      <DeleteIcon />{' '}
                    </a>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.footerPagination}>
        <small>Showing 5 out of 25 entries</small>
        <nav>
          <ul>
            <li>
              <a href="#">
                <small>&laquo;</small>
              </a>
            </li>
            <li>
              <a href="#">
                <small>1</small>
              </a>
            </li>
            <li>
              <a href="#">
                <small>2</small>
              </a>
            </li>
            <li>
              <a href="#">
                <small>3</small>
              </a>
            </li>
            <li>
              <a href="#">
                <small>&raquo;</small>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
