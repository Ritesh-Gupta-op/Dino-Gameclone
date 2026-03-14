import {
  setupDino,
  updateDino,
  getDinoRect,
  setDinoLose,
} from "./dino.js"
import { setupCactus, updateCactus, getCactusRects } from "./cactus.js"
import { setupGround, updateGround } from "./ground.js"
import { setupclouds, updateclouds } from "./clouds.js"

const worldElem = document.querySelector("[data-world]")
const scoreElem = document.querySelector("[data-score]")
const startScreenElem = document.querySelector("[data-start-screen]")

let lastTime
let speedScale
let score
function update(time) {
  if (lastTime == null) {
    lastTime = time
    window.requestAnimationFrame(update)
    return
  }
  const delta = time - lastTime

  updateGround(delta, speedScale)
  updateDino(delta, speedScale)
  updateCactus(delta, speedScale)
  updateclouds(delta, speedScale)
  updateSpeedScale(delta)
  updateScore(delta)

  if (checkLose()) return handleLose()

  lastTime = time
  window.requestAnimationFrame(update)
}

function checkLose() {
  const dinoRect = getDinoRect()
  return getCactusRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  )
}

function updateSpeedScale(delta) {
  speedScale += delta * 0.00001
}

function updateScore(delta) {
  score += delta * 0.01
  scoreElem.textContent = Math.floor(score)
}

function handleStart() {
  lastTime = null
  speedScale = 1
  score = 0
  setupGround()
  setupDino()
  setupCactus()
  setupclouds()
  startScreenElem.classList.add("hide")
  window.requestAnimationFrame(update)
}

function handleLose() {
  setDinoLose()
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true })
    startScreenElem.classList.remove("hide")
  }, 100)
}

document.addEventListener("keydown", handleStart, { once: true })