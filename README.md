# SignBridge — Indian Sign Language Recognition System

SignBridge is a web application that helps deaf and hearing people communicate in
Indian Sign Language (ISL). Users capture photos of gestures with a webcam, and a
deep learning model recognises the phrase and builds it into a sentence.

## Screenshots
![Home page](docs/home.png)
![Camera Translate](docs/camera-translate.png)
![Phrase Library](docs/phrase-library.png)

## Features
- **Camera Translate** – one photo per gesture with a 5-second timer (for two-handed signs); recognised phrases build into a full sentence
- **Text Chat** – send and read typed messages
- **Phrase Library** – everyday phrases (greetings, food, weather, daily life) with gesture previews
- **Emergency Phrases** – one-tap blocks for medical help, help, directions, police, fire, water/food
- **Practice Mode** – learn a phrase, try the gesture, mark the attempt, streak counter
- **History Log** – every user's own activity, saved in the database
- **Accessibility** – high-contrast mode and adjustable text size
- **Accounts** – registration and login with validation (two-word name, valid email, strong password), BCrypt-hashed passwords, password reset

## Architecture
Browser (HTML/CSS/JavaScript) → Spring Boot REST API → PostgreSQL
                                        ↓
                         Flask prediction service → MobileNetV2 model

## Tech stack
| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (Fetch API, MediaDevices camera API) |
| Backend | Java 21, Spring Boot, Spring Data JPA, Maven |
| Database | PostgreSQL |
| ML service | Python, Flask, TensorFlow/Keras, Pillow, NumPy |

## Recognition model
- MobileNetV2 (ImageNet weights, frozen) with a new head: Global Average Pooling, Dropout (0.3), Dense (softmax, 58 classes)
- Trained for 15 epochs; 1,720 training and 430 validation images
- Validation accuracy: **97.67%** on the held-out split
- 58 classes = phrases from the public dataset below, plus 14 custom phrases, with 3 dataset classes replaced by custom ones

## API overview
| Endpoint | Purpose |
|---|---|
| `POST /api/users/register`, `/login`, `/reset-password` | Accounts |
| `GET /api/phrases`, `GET /api/emergency` | Phrase Library and Emergency content |
| `POST /api/translate` | Send a photo for recognition |
| `GET/POST /api/history` | User activity log |

## Database
Six tables: `users`, `phrases`, `emergency_phrases`, `chat_messages`,
`translation_history`, `practice_attempts`.

## Run locally
1. Install Java 21, PostgreSQL and Python 3.
2. Create a PostgreSQL database named `signbridge_db`.
3. Set the `DB_PASSWORD` environment variable to your PostgreSQL password.
4. Start the web app: `./mnt/mvnw spring-boot:run` (or run `SignbridgeApplication` from your IDE).
5. Start the prediction service: `cd ml-service`, then `python predict_api.py`
6. Open http://localhost:8080

## Limitations
- Works on static photos only (no video or motion-based signs)
- Recognises 58 trained phrases; live accuracy depends on lighting, background and hand position
- Gesture reference images were used to train the custom phrases, so adding real photos would improve live accuracy
- Password reset does not verify the email address

## Future work
Hand-landmark detection, continuous sign recognition from video, voice output,
typed-text-to-sign display, a mobile app.

## Dataset credit
Public everyday-phrases ISL dataset: S. Saipatwar et al., *Dataset for everyday phrases
and words in Indian sign language*, Mendeley Data, V3, 2025.
DOI: 10.17632/w7fgy7jvs8.3

## Author
Shweta Ghadage — SKN Sinhgad College of Engineering, Korti, Pandharpur
