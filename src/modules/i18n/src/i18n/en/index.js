import v from './validations.js';
import dialog from './dialog.js';
import datatable from './datatable.js';
import actions from './actions.js';
import messages from './messages.js';
import confirm from './confirm.js';

export default {
  languages: {
    en: "English",
    tr: "Turkish"
  },
  v,
  form: {
    saved: "Saved successfully"
  },
  error: {
    notFound: "Page not found",
    fileNotFound: "File not found"
  },
  categories: {
    name: "Name",
    parentId: "Parent Category",
    move: "Move"
  },  
  datatable,
  dataiterator: {
    displayingPage: "Displaying page {page} of {pageCount}"
  },
  pages: {
    list: "{resource}",
    create: "New Record",
    show: "Detail",
    edit: "Edit Record",
    notFound: "{resource} not found"
  },
  search: {
    q: "Search"
  },
  actions,
  messages,
  confirm,
  datepicker: {
    title: "Select Date",
    cancel: "Cancel",
    select: "Select"
  },
  dialog
}