import './NotesPage.scss';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import type { AutoNote } from '../../types/types';
import {
  useAutoNotesServiceAutoNotesControllerFindAll,
  useAutoNotesServiceAutoNotesControllerRemove,
} from '../../generated/api/queries';
import React, { ReactNode, useEffect, useState } from 'react';
import { ROUTE_PARTS } from '../../App';
import { toast } from 'react-toastify';

interface NotesPageProps {}

function NotesPage({}: NotesPageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const action = params.action;
  const id = params.id;
  const [selectedNote, setSelectedNote] = useState<AutoNote | null>(null);

  const { data: notes, refetch: refetchNotes } = useAutoNotesServiceAutoNotesControllerFindAll({
    term: '',
  });
  const { mutateAsync: deleteNote } = useAutoNotesServiceAutoNotesControllerRemove();

  useEffect(() => {
    if (notes) {
      // Set autoTag from url id
      const noteFromUrl = (notes.find((note) => note.id === id) || null) as AutoNote | null;
      setSelectedNote(noteFromUrl);
    }
  }, [id, notes]);

  return (
    <div className="p-tag-names">
      <button
        className="c-button"
        onClick={() => navigate('/' + ROUTE_PARTS.notes + '/' + ROUTE_PARTS.create)}
      >
        Add note
      </button>

      <ul>
        {(notes || []).map(
          (note): ReactNode => (
            <li className="c-row" key={'tag-name-' + note.id}>
              <span className="flex-grow">{note.name}</span>
              <button
                className="c-button"
                onClick={() => {
                  setSelectedNote(note as unknown as AutoNote);
                  navigate('/' + ROUTE_PARTS.notes + '/' + note.id + '/' + ROUTE_PARTS.edit);
                }}
              >
                EDIT
              </button>
              <button
                className="c-button"
                onClick={async () => {
                  if (note.id) {
                    await deleteNote({
                      id: note.id,
                    });
                    await refetchNotes();

                    toast('Note has been deleted', { type: 'success' });
                  } else {
                    toast('Note could not be deleted, no id has been set', { type: 'warning' });
                  }
                }}
              >
                DELETE
              </button>
            </li>
          )
        )}
      </ul>

      <Outlet />
    </div>
  );
}

export default NotesPage;
