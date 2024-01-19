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
import correct from './assets/correct.png'
import incorrect from './assets/incorrect.png'
import play from './assets/play.jpg'
import reset from './assets/reset.jpg'
const App = () => {
	// Счетчик попыток угадать слово
	const [count, setCount] = useState(0)
	const [countWin, setCountWin] = useState(0)
	const [countDefeat, setCountDefeat] = useState(0)
	const [start, setStart] = useState(true)
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
	// Выбор категории
	const [selectedCategory, setSelectedCategory] = useState(null)
	// Кол-во неугаданных букв
	const [incorrectCount, setIncorrectCount] = useState(0)
	// Слова которые были угаданы
	const [firstWord, setFirstWord] = useState([])
	const arrWord = word.map(element => element.props.children)

	const startGo = () => {
		setStart(true)
	}
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

		const wordList = wordCategory.word
		if (selectedCategory) {
			const availableWords = wordList.filter(word => !firstWord.includes(word))
			const wordShow =
				availableWords[Math.floor(Math.random() * availableWords.length)]
			if (availableWords.length === 0) {
				// Если отгаданы все слова, сброс массива отгаданных слов
				setFirstWord([])
				return
			}

			setFirstWord(prev => [...prev, wordShow])

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
			setStart(false)
		} else {
			console.log('Категория не найдена.')
			return
		}
	}

	const getLetterAlphabet = element => {
		const symbol = alphabet.find(el => el === element)
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
				const isWordComplete = arrWord.every(letter =>
					newCorrectLetters.includes(letter)
				)
				if (isWordComplete) {
					setCountWin(countWin + 1)
					setWin(true)
					// handleRandomWord()
				}
				return newCorrectLetters
			})
		} else {
			setInCorrectLetters(prev => {
				return [...prev, foundElement]
			})

			if (inCorrectLetters.includes(foundElement)) {
				return
			}

			if (count < 5) {
				setCount(count + 1)
				setIncorrectCount(incorrectCount + 1)
			} else {
				setDefeat(true)
				setCountDefeat(countDefeat + 1)
				setCount(0)
				setIsPlay(false)
			}
		}
	}
	return (
		<div className='App'>
			{selectedCategory ? (
				<div className='wrapper'>
					{start ? (
						<>
							<button className='start' onClick={handleRandomWord}>
								start
							</button>
						</>
					) : (
						<div className='progress'>
							{defeat || win ? (
								<>
									<div className='game_over'>
										<div className='game_over-buttons'>
											<div className='game_over-btn' onClick={handleRandomWord}>
												<img src={play} alt='' />
											</div>
											<div
												className='game_over-btn'
												onClick={handleResetCategory}
											>
												<img src={reset} alt='' />
											</div>
										</div>
										<div className='game_over-images'>
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
					)}
					<div className='field'>
						<div className='field__word'>
							<div
								className={`field__word_hidden_item ${defeat ? 'check' : ''}`}
							>
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
						<div className='count'>
							<span className='count-win'>
								<img src={correct} alt='correct' /> {countWin}
							</span>
							<span className='count-defeat'>
								<img src={incorrect} alt='incorrect' /> {countDefeat}
							</span>
						</div>
					</div>
				</div>
			) : (
				<div className='selected'>
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
				</div>
			)}
		</div>
	)
}

export default App
