import React, { useState, useEffect } from 'react'
import { alphabet } from './utils/alphabet'
import { randomWord } from './utils/words'
import play from './assets/play.png'
import sad from './assets/sad.png'
import happy from './assets/happy.png'
const App = () => {
	// Счетчик попыток угадать слово
	const [count, setCount] = useState(0)
	// Проигрыш
	const [defeat, setDefeat] = useState(false)
	// Победа
	const [win, setWin] = useState(false)
	// Начало игры, кнопки не активны
	const [isPlay, setIsPlay] = useState(false)
	// Массив правильных букв
	const [correctLetters, setCorrectLetters] = useState([])
	// Случайное слово
	const [word, setWord] = useState([])
	// Случайная категория
	const [category, setCategory] = useState([])
	// Видимые буквы
	const [visibleLetters, setVisibleLetters] = useState([])
	// Выбор категории
	const [selectedCategory, setSelectedCategory] = useState('')

	const arrWord = word.map(element => element.props.children)

	const handleRandomWord = () => {
		setCorrectLetters([])
		setCount(0)

		// Проверка, выбрана ли категория
		if (!selectedCategory) {
			alert('Выберите категорию перед началом игры.')
			return
		}

		
		const wordCategory = randomWord.find(category => category.category === selectedCategory)
		const wordList = wordCategory.words
		const wordShow = wordList[Math.floor(Math.random() * wordList.length)]

		setCategory(wordCategory.category)
		const generateHiddenLetters = () => {
			const lettersArray = wordShow.split('')

			// Выбираем две случайные буквы для отображения
			const visibleLetters = []
			while (visibleLetters.length < 2) {
				const randomIndex = Math.floor(Math.random() * lettersArray.length)
				if (!visibleLetters.includes(lettersArray[randomIndex])) {
					visibleLetters.push(lettersArray[randomIndex])
				}
			}

			// Обновляем массив word, чтобы показать две отображаемые буквы
			const updatedWord = lettersArray.map((letter, index) => (
				<div
					key={index}
					className={`field__word_hidden_item-word ${
						visibleLetters.includes(letter) ? '' : 'hidden'
					}`}
				>
					{visibleLetters.includes(letter) ? letter : letter}
				</div>
			))

			// Устанавливаем две отображаемые буквы в состояние
			setVisibleLetters(visibleLetters)

			setCorrectLetters(prevCorrectLetters => {
				const newCorrectLetters = [...prevCorrectLetters, ...visibleLetters]
				console.log(newCorrectLetters)
				return newCorrectLetters
			})

			setWord(updatedWord)
		}

		generateHiddenLetters()
		setIsPlay(true)
		setDefeat(false)
		setWin(false)
	}

	const getLetterAlphabet = element => {
		return alphabet.find(el => el === element)
	}
	const check = event => {
		const element = event.target.textContent
		const foundElement = getLetterAlphabet(element)
		if (arrWord.includes(foundElement)) {
			console.log('Правильная буква')

			setCorrectLetters(prevCorrectLetters => {
				const newCorrectLetters = [...prevCorrectLetters, foundElement]
				console.log(newCorrectLetters)

				setWord(prevWord => {
					const updatedWord = prevWord.map((element, index) => {
						const letter = element.props.children
						const isHidden = !newCorrectLetters.includes(letter)
						console.log(letter, isHidden)
						return (
							<div
								key={element.key}
								className={`field__word_hidden_item-word ${
									isHidden ? 'hidden' : ''
								}`}
							>
								{newCorrectLetters.includes(letter) ? letter : letter}
							</div>
						)
					})
					return updatedWord
				})
				return newCorrectLetters
			})
		} else {
			if (count < 5) {
				setCount(count + 1)
			} else {
				setDefeat(true)
				setCount(0)
			}
		}
	}

	useEffect(() => {
		const isWordComplete = arrWord.every(letter =>
			correctLetters.includes(letter)
		)
		if (isWordComplete) {
			setWin(true)
			setTimeout(() => {
				setWin(false)
				handleRandomWord()
			}, 2000);
		}
	}, [correctLetters])

	return (
		<div className='App'>
			<div className='wrapper'>
				{defeat && (
					<div className='defeat'>
						<div className='defeat__word'>{arrWord}</div>
						<div className='defeat__content'>
							<img src={sad} alt='sad' />
						</div>

						<div className='defeat__repeat'>
							<button className='field__button' onClick={handleRandomWord}>
								<img src={play} alt='play' />
							</button>
						</div>
					</div>
				)}
				{win && (
					<div className='win'>
						<div className='win__word'>{arrWord}</div>
						<div className='win__content'>
							<img src={happy} alt='happy' />
						</div>
					</div>
				)}

				<div className={`field ${defeat || win ? 'game-over' : ''}`}>
					<div className='field__word'>
					<select
              className='field__category_select'
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value='' disabled selected>
                Выберите категорию
              </option>
              {randomWord.map(category => (
                <option key={category.category} value={category.category}>
                  {category.category}
                </option>
              ))}
            </select>
						<div className='field__word_hidden_item'>{word}</div>
						<button className='field__button' onClick={handleRandomWord}>
							<img src={play} alt='play' />
						</button>
					</div>
					<div className='field__progress'>
						{isPlay && <span>{count} / 6 </span>}
					</div>
					<div className='field__alphabet'>
						{alphabet.map((item, i) => (
							<div
								className={`field__alphabet_item ${isPlay && 'play'} `}
								key={i}
								onClick={check}
							>
								{item}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default App
