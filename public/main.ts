// =============================================================================
// Описание работы приложения.
// Приложение запускается в своем начальном состоянии: установлен дефолтный вон страницы,
// воспроизведение аудиофайла остановлено.
// Страница содержит 4 функциональных элемента: 3 кнопки и регулятор громкости.
// Регулятор устанавливает громкость воспроизведение аудиофайла.
// Кнопки переключают фон страницы и аудиофайл.
// У каждой кнопки может быть 3 возможных состояния:
// 1. "Активна" - на кнопке показана ее иконка и воспроизводиться ее аудиофайл.
// 2. "Неактивна" - на кнопке нет никаких иконок, аудиофайл не воспроизводится.
// 3. "Пауза" - на кнопке показана иконка паузы, воспроизведение аудиофайла приостановлено.
// А. При клике на неактивную кнопку на ней появляется ее иконка и запускается воспроизведение аудиофайла.
// Кнопка бывшая активной до клика переходит в состояние "Неактивна".
// Б. При клике на активную кнопку она переходит в состояние "Пауза".
// В. При клике на приостановленную кнопку она переходит в состояние "Активна".
// После завершения воспроизведения аудиофайла все кнопки переходят в состояние "Неактивна".
// =============================================================================

// Элемент шаблона, у которого должен меняться фон при нажатии кнопки
const main_bg = document.getElementById('cards_bg');

// Регулятор громкости
const volume: HTMLInputElement = document.getElementById('volume') as HTMLInputElement;

// Интерфейс кнопки
interface ICard {
  bg: string; // путь до файла фона
  soundFile: string; // путь до файла аудио
  active?: boolean; // флаг дефолтной кнопки для выбора фона страницы при запуске приложения
}

// Интерфейс карты кнопок
interface CardMap {
  [id: string]: ICard;
}
// Карта свойств кнопок
const cardsMap = {
  sun: {
    bg: '/assets/summer-bg.jpg',
    soundFile: '/assets/sounds/summer.mp3',
    active: true,
  },
  rain: {
    bg: '/assets/rainy-bg.jpg',
    soundFile: '/assets/sounds/rain.mp3',
  },
  snow: {
    bg: '/assets/winter-bg.jpg',
    soundFile: '/assets/sounds/winter.mp3',
  },
} as CardMap;

// Класс кнопки
class Card {
  readonly bg: string;
  readonly sound: HTMLAudioElement;
  readonly active?: boolean;
  readonly elem: HTMLElement | null;

  // Создадим кнопку и заполним ее св-ва из карты
  constructor(private id: string, { bg, soundFile, active }: ICard) {
    // Фон для кнопки и страницы
    this.bg = bg;
    // Маркер дефолтной кнопки
    this.active = active;

    // Аудиофайл для кнопки
    this.sound = new Audio(soundFile);
    // Предзагрузка аудиофайла
    this.sound.load();

    // Элемент кнопки в шаблоне
    this.elem = document.getElementById(id);
    // Слушатель клика на кнопку
    this.elem?.addEventListener('click', () => {
      clickCard(this);
    });
  }

  // Показать естественную иконку на кнопке
  startCard() {
    this.elem?.classList.remove('paused');
    this.elem?.classList.add('active');
  }

  // Удалить все иконки с кнопки
  stopCard() {
    this.elem?.classList.remove('active');
    this.elem?.classList.remove('paused');
  }

  // Показать иконку паузы
  pauseCard() {
    this.elem?.classList.remove('active');
    this.elem?.classList.add('paused');
  }
}

// Класс плеера
class Player {
  constructor(public track: HTMLAudioElement) {}

  // Включить воспроизведение аудио
  startPlayer() {
    this.track.play();
  }

  // Остановить воспроизведение аудио
  stopPlayer() {
    this.track.pause();
    this.track.currentTime = 0;
  }

  // Приостановить воспроизведение аудио
  pausePlayer() {
    this.track.pause();
  }
}

// Создание экземпляров класса кнопок из карты кнопок
const cards: Array<Card> = [];
Object.keys(cardsMap).forEach((key) => {
  cards.push(new Card(key, cardsMap[key]));
});

// Поиск дефолтной кнопки в массиве
// Если отсутствует маркер дефолтной - выбрать первую в массиве
let activeCard: Card = cards.find((c) => c.active) ?? cards[0];

// Если не найдена дефолтная кнопка - значит не заполнена карта.
// Выдать ошибку
if (!activeCard) {
  throw new Error('Fill cards map properly');
}

// Инициализация состояния приложения

// Установка фона страницы
setBackground(activeCard.bg);

// Создание экземпляра плеера с дефолтным аудиофайлом
const player = new Player(activeCard.sound);

// Установка слушателей событий изменения громкости и окончания воспроизведения аудиофайла
addListeners();

// Установка громкости воспроизведения
player.track.volume = parseFloat(volume.value);

// Включение кнопки и воспроизведения аудиофайла
function start() {
  player.startPlayer();
  activeCard.startCard();
}

// Выключение кнопки и воспроизведения аудиофайла
function stop() {
  player.stopPlayer();
  activeCard.stopCard();
}

// Пауза кнопки и приостановка аудиофайла
function pause() {
  player.pausePlayer();
  activeCard.pauseCard();
}

// Создание прослушивателей
function addListeners() {
  // Установить слушатель естественного окончания воспроизведения аудиофайла
  player.track.addEventListener('ended', () => {
    activeCard.stopCard();
  });
  // Установить слушатель регулятора громкости
  volume.addEventListener('change', () => {
    player.track.volume = parseFloat(volume.value);
  });
}

// Удаление прослушивателей с кнопки ставшей неактивной
function removeListeners() {
  // Удалить слушатель естественного окончания воспроизведения аудиофайла
  player.track.removeEventListener('ended', () => {
    activeCard.stopCard();
  });
  // Удалить слушатель регулятора громкости
  volume.removeEventListener('change', () => {
    player.track.volume = parseFloat(volume.value);
  });
}

// Переключение на другую кнопку
function change(card: Card) {
  // Остановить текущее воспроизведение
  stop();
  // Удалить слушателей событий изменения громкости и окончания воспроизведения аудиофайла
  removeListeners();
  // Изменить активную кнопку
  activeCard = card;
  // Загрузить в плеер новый аудиофайл
  player.track = activeCard.sound;
  // Задать аудиофайлу громкость воспроизведения
  player.track.volume = parseFloat(volume.value);
  // Изменить фон страницы
  setBackground(activeCard.bg);
  // Установка слушателей событий изменения громкости и окончания воспроизведения аудиофайла
  addListeners();
  // Показ иконки воспроизведения на кнопке и включение воспроизведения аудиофайла
  start();
}

// Переключение состояния активной кнопки
function toggle() {
  // Получение спика классов активной кнопки
  const cardClasses = activeCard.elem?.classList;
  // Если кнопка не активна(закончилось воспроизведение ее аудиофайла) или приостановлена,
  // то показать иконку воспроизведеня на кнопке и запустить воспроизведение ее аудиофайла
  if (!cardClasses?.contains('active') || cardClasses?.contains('paused')) {
    start();
    return;
  }
  // Если кнопка нажата, то приостановить воспроизведение ее аудиофайла и показать иконку паузы на кнопке
  if (cardClasses?.contains('active')) {
    pause();
  }
}

// Установка фона страницы
function setBackground(path: string) {
  main_bg!.style.setProperty('background-image', `url(${path})`);
}

// Обработка клика по кнопке
function clickCard(card: Card) {
  // Если нажата активная унопка, то переключить ее состояние
  if (activeCard === card) {
    toggle();
    return;
  }
  // Если нажата новая кнопка, то сделать ее активной
  change(card);
}
