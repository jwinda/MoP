import { useEffect, useState, useRef, ChangeEvent, MouseEvent } from 'react';
import { TypeUserProfile } from '../../interfaces/User.interface';
import { getUserProfile } from '../../apis/Fetcher';
import Stack from "../../components/Stack";
import styles from './updateUser.module.scss';
import { RiAddCircleFill } from 'react-icons/ri';

function UpdateUser() {
  const [user, setUser] = useState<TypeUserProfile>();
  const [imageSrc, setImageSrc] = useState(user?.user_img);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 글자수 제한을 위한 상태관리
  const [inputName, setInputName] = useState<String>('');
  const [inputIntro, setInputIntro] = useState<String>('');
  const [inputCareer, setInputCareer] = useState<String>('');

  const MAX_NAME_COUNT = 50;
  const MAX_INTRO_COUNT = 250;
  const MAX_CAREER_COUNT = 50;

  const handleImageChange = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    max: number, 
    title: string
    ) => {
      switch (title) {
        case 'name': {
          const { value } = e.target;
          if (value.length <= max) {
            setInputName(value);
          }
          break;
        }
        case 'intro': {
          const { value } = e.target;
          if (value.length <= max) {
            setInputIntro(value);
          }
          break;
        }
        case 'career': {
          const { value } = e.target;
          if (value.length <= max) {
            setInputCareer(value);
          }
          break;
        }
      }
  }

  const handleSumbit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('완료 버튼 클릭');
  }

  const getUserData = async () => {
    try {
      const userList = await getUserProfile();
      setUser(userList);
      setImageSrc(userList.user_img);
      setInputName(userList.user_name);
      setInputIntro(userList.user_introduction);
      setInputCareer(userList.user_career_goal);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div className={styles.imageContainer}>
          <img 
            className={styles.image} 
            src={imageSrc} 
            alt={user?.user_name}
            onClick={handleImageChange}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className={styles.fileInput}
            ref={fileInputRef}
          />
          <RiAddCircleFill 
            className={styles.addButton} 
            onClick={handleImageChange} 
          />
        </div>
        <div className={styles.nameContainer}>
          <label className={styles.name}>이름</label>
          <input 
            type="text" 
            defaultValue={user?.user_name}
            placeholder="이름을 입력해 주세요."
            maxLength={MAX_NAME_COUNT}
            onChange={(e) => handleChange(e, MAX_NAME_COUNT, 'name')}
          />
          <p>{inputName.length}/{MAX_NAME_COUNT}</p>
        </div>
        <div className={styles.introContainer}>
          <label>자기소개</label>
          <textarea
            defaultValue={user?.user_introduction}
            placeholder="자기소개를 입력해 주세요."
            maxLength={MAX_INTRO_COUNT}
            onChange={(e) => handleChange(e, MAX_INTRO_COUNT, 'intro')}
          />
          <p>{inputIntro.length}/{MAX_INTRO_COUNT}</p>
        </div>
        <div className={styles.CareerContainer}>
          <label>원하는 직군</label>
          <input 
            type="text" 
            defaultValue={user?.user_career_goal}
            placeholder="원하는 직군을 입력해 주세요."
            maxLength={MAX_CAREER_COUNT}
            onChange={(e) => handleChange(e, MAX_CAREER_COUNT, 'career')}
          />
          <p>{inputCareer.length}/{MAX_CAREER_COUNT}</p>
        </div>
        <Stack />
        <button 
          className={styles.submitButton}
          onClick={handleSumbit}
        >
          완료
        </button>
      </form>
    </div>
  )
}

export default UpdateUser;