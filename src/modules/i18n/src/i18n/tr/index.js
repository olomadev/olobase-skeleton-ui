import v from './validations.js';
import dialog from './dialog.js';
import datatable from './datatable.js';
import actions from './actions.js';
import messages from './messages.js';
import confirm from './confirm.js';

export default {
  languages: {
    en: "English",
    tr: "Türkçe"
  },
  v,
  form: {
    saved: "Başarıyla Kaydedildi"
  },
  error: {
    notFound: "Sayfa bulunamadı",
    fileNotFound: "Dosya bulunamadı"
  },
  categories: {
    name: "Ad",
    parentId: "Üst Kategori",
    move: "Taşı"
  },
  datatable,
  dataiterator: {
    displayingPage: "{pageCount} sayfadan {page} sayfası görüntüleniyor "
  },
  pages: {
    list: "{resource}",
    create: "Yeni Kayıt",
    show: "Detay",
    edit: "Kayıt Düzenle",
    notFound: "{resource} bulunamadı"
  },
  search: {
    q: "Ara"
  },
  actions,
  messages,
  confirm,
  datepicker: {
    title: "Tarih Seç",
    cancel: "İptal",
    select: "Seç"
  },
  dialog
}
