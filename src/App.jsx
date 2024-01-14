import React, { useState, useEffect } from 'react'
import { alphabet } from './utils/alphabet'
import { randomWord } from './utils/words'
import {
	test,
	test2,
	test3,
	test4,
	test5,
	test6,
	test7,
	test8,
} from './assets/progress'
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
	// Массив неправильных букв
	const [inCorrectLetters, setInCorrectLetters] = useState([])
	// Случайное слово
	const [word, setWord] = useState([])
	// Случайная категория
	const [category, setCategory] = useState([])
	// Видимые буквы
	const [visibleLetters, setVisibleLetters] = useState([])
	// Выбор категории
	const [selectedCategory, setSelectedCategory] = useState(null)
	// Кол-во неугаданных букв
	const [incorrectCount, setIncorrectCount] = useState(0)

	const arrWord = word.map(element => element.props.children)
	const handleResetCategory = () => {
		setSelectedCategory(null)
	}
	const handleRandomWord = () => {
		setCorrectLetters([])
		setInCorrectLetters([])
		setCount(0)
		setIncorrectCount(0)

		const wordCategory = randomWord.find(
			category => category.category === selectedCategory
		)
		if (!wordCategory) {
			console.log('Категория не найдена.')
			return
		}
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
		const symbol = alphabet.find(el => el === element)
		console.log(symbol)
		return symbol
	}
	const check = event => {
		const element = event.target.textContent
		const foundElement = getLetterAlphabet(element)

		if (arrWord.includes(foundElement)) {
			setCorrectLetters(prevCorrectLetters => {
				const newCorrectLetters = [...prevCorrectLetters, foundElement]

				setWord(prevWord => {
					const updatedWord = prevWord.map((element, index) => {
						const letter = element.props.children
						const isHidden = !newCorrectLetters.includes(letter)
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
			setInCorrectLetters(prev => {
				return [...prev, foundElement]
			})
			if (inCorrectLetters.includes(foundElement)) {
				return
			}
			console.log(inCorrectLetters)
			if (count < 5) {
				setCount(count + 1)
				setIncorrectCount(incorrectCount + 1)
			} else {
				setDefeat(true)
				setCount(0)
				setIsPlay(false)
			}
		}
	}

	useEffect(() => {
		const isWordComplete = arrWord.every(letter =>
			correctLetters.includes(letter)
		)
		if (isWordComplete) {
			setWin(true)
		} else {
			return
		}
	}, [correctLetters])

	return (
		<div className='App'>
			{selectedCategory ? (
				<div className='wrapper'>
					<div className='progress'>
						{defeat || win ? (
							<>
								<div className='game_over'>
									<span className='game_over-btn' onClick={handleRandomWord}>
										Еще раз
									</span>
									<span className='game_over-btn' onClick={handleResetCategory}>
										Выбрать тему
									</span>
									{defeat && (
										<>
											<img src={test7} alt='sad' />
										</>
									)}
									{win && (
										<>
											<img src={test8} alt='happy' />
										</>
									)}
								</div>
							</>
						) : (
							<>
								{incorrectCount === 0 && <img src={test} alt='test' />}
								{incorrectCount === 1 && <img src={test2} alt='image1' />}
								{incorrectCount === 2 && <img src={test3} alt='image2' />}
								{incorrectCount === 3 && <img src={test4} alt='image3' />}
								{incorrectCount === 4 && <img src={test5} alt='image3' />}
								{incorrectCount === 5 && <img src={test6} alt='image3' />}
							</>
						)}
					</div>
					<div className='field'>
						<div className='field__word'>
							<div className={`field__word_hidden_item ${defeat ? 'check' : ''}`}>
								{defeat ? arrWord : word}
							</div>
						</div>
						<div className='field__alphabet'>
							{alphabet.map((item, i) => (
								<div
									className={`field__alphabet_item ${isPlay && 'play'} ${
										correctLetters.includes(item) ? 'correct' : ''
									}  ${inCorrectLetters.includes(item) ? 'incorrect' : ''} `}
									key={i}
									onClick={check}
								>
									{item}
								</div>
							))}
						</div>
					</div>
				</div>
			) : (
				<>
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
				</>
			)}
		</div>
	)
}

export default App
