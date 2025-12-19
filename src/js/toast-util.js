// Lazy-load iziToast only when needed
let iziToastInstance = null;

async function getIziToast() {
  if (iziToastInstance) return iziToastInstance;

  const iziToast = await import('izitoast');
  await import('izitoast/dist/css/iziToast.min.css');
  iziToastInstance = iziToast.default;
  return iziToastInstance;
}

export async function showError(message, options = {}) {
  const iziToast = await getIziToast();
  iziToast.error({
    message,
    position: 'topRight',
    color: '#f2aaaaff',
    icon: false,
    progressBar: false,
    messageColor: 'black',
    ...options,
  });
}

export async function showInfo(message, options = {}) {
  const iziToast = await getIziToast();
  iziToast.info({
    message,
    position: 'topRight',
    ...options,
  });
}

export async function showSuccess(message, options = {}) {
  const iziToast = await getIziToast();
  iziToast.success({
    message,
    position: 'topRight',
    ...options,
  });
}
