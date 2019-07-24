# Тестовое задание для ARRIVAL
![preview](https://github.com/GM2mars/tarrival/raw/master/preview.png)
[посмотреть вживую](https://gm2mars.github.io/)
## Исходные данные
[ссылка на тестовое задание](https://gist.github.com/gomaxnn/687f1051c48f85a40ce89bcbf74ed275)

## Что было сделано
1. Отрисовка графика по заданным данным с бейджами
2. Скеил графиков при изменении размера окна
3. Динамический таймлайн с привязкой к курсору
4. Базовая страница с выводом всех сигналов на основе массива данных

## Что не было сделано
1. Логика добавления/удаления сигналов
2. Запрос данных с удаленного api (данные лежат в виде js объекта)
3. Некоторые стилевые моменты в оформлении

## Основные трудности
Немалая часть времени ушла на изучение библиотеки d3 и отрисовки svg изображений.
Не сразу понял как мержить данные в выборке группы в svg для динамического обновления параметров.  
Не разрешил проблему с наложением точки среза времени на бейджи, видимо нужно делать области скрытия на длину бейджев.

## Проект

### Структура папок
1. 'components' - компоненты проекта
+ 'Dashboard' - панель с сигналами, там же располагается таймлайн
+ 'Signal' - график сигнала
2. 'pages' - страницы проекта
+ 'DiagnosticPage' - страница диагностики
3. 'enums' - все перечисления, которые встречаются в проекте
4. 'interfaces' - типы данных
5. 'style' - общие стили и картинки

### Структура файлов и нейминг
Все именные файлы названы в CamelCase нотации. Разделение по типам происходит путем добавления суффикса
'.service', '.style', '.config'. В папках компонентов, страниц, интерфейсов и перечислений используется
индексный файл для более удобного импорта.

### Структура модулей
Всю логику по отрисовке графиков и таймлайнов я вынес в отдельный файл и реализовал в виде
класса-сервиса. А в самом реактовском компоненте уже оперирую методами сервиса. Это нам дает более чистые
и не перегруженные файлы компонентов.

### Конфигурация
Для удобства конфигурацию сигналов я вынес в отдельный файл с суффиксом '.config', в котором лежит
объект описывающий базовые типы сигналов - цвет, path для бейджа, лейблы и так далее.
Вся информация берется из перечислений enums.

## Команды для сборки и запуска

```bash
# скачивание библиотек
npm install
# запуск на дев сервере
npm start
# сборка
npm build
```
