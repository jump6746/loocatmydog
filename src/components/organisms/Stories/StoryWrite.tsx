import ProfileImage from '@/components/atoms/ProfileImage/ProfileImage';
import styled from 'styled-components';
import { Form, redirect, useLocation } from 'react-router-dom';
import Photo from '@/components/atoms/Photo/Photo';
import { ChangeEvent, MouseEvent, useState } from 'react';
import pb from '@/api/pocketbase';
import getFirstPathName from '@/utils/getFirstPathName';

const StyledStoryWrite = styled.div`
  inline-size: 100%;
  block-size: 75%;

  .write-submit {
    position: absolute;
    right: 12px;
    top: 12px;
    inline-size: 60px;
    block-size: 26px;
    border-radius: 13px;
    background-color: ${(props) => props.theme.colors.primary};
    padding: 4px 6px;
    ${(props) => props.theme.fontStyles.textSemiboldMd}
  }

  .textArea-wrapper {
    display: flex;
    inline-size: 100%;
    block-size: 100%;
    padding: 10px 12px;
    gap: 10px;

    & Form {
      inline-size: 87.25%;
      padding: 10px 0px;
    }

    & textarea {
      border: 0px;
      inline-size: 100%;
      block-size: 100%;
      resize: none;
    }

    & textarea:focus {
      outline: none;
    }
  }

  .photoAdd-wrapper {
    display: flex;
    gap: 10px;
    padding: 0px 20px;
  }
`;

/* 
  id
  userId
  avatar
  type
  content
  photos
  created
*/
const imageFiles: File[] = [];

const StoryWrite = () => {
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  const handleImageInput = (e: ChangeEvent<HTMLInputElement>) => {
    let file;

    if (e.target.files && e.target.files[0]) {
      file = e.target.files[0];
      imageFiles.push(file);
    }

    if (imageURLs.length === 4) {
      alert('이미지 등록은 4개까지만 가능합니다');
      return;
    }

    const fileURL = URL.createObjectURL(file as Blob);

    if (fileURL) {
      setImageURLs([...imageURLs, fileURL]);
      e.target.value = '';
    }
  };

  const handleImageDelete = (e: MouseEvent<HTMLButtonElement>) => {
    const currentSource = e.currentTarget.dataset.src;
    setImageURLs(
      imageURLs.filter((url, index) => {
        imageFiles.splice(index, 1);
        return url !== currentSource;
      })
    );
  };

  return (
    <StyledStoryWrite>
      <button className="write-submit" type="submit" form="storyForm">
        게시하기
      </button>
      <div className="textArea-wrapper">
        <ProfileImage />
        <Form id="storyForm" method="post">
          <label htmlFor="textArea"></label>
          <textarea
            name="textArea"
            id="textArea"
            placeholder="공유하고 싶은 이야기가 있나요?"
            required
          />
        </Form>
      </div>
      <div className="photoAdd-wrapper">
        <Photo type={'default'} onChange={handleImageInput} />
        {imageURLs.map((url, index) => (
          <Photo
            key={index}
            type={'picture'}
            imgSrc={url}
            onClick={handleImageDelete}
          />
        ))}
        <Photo type={'total'} currentImageNum={imageURLs.length} />
      </div>
    </StyledStoryWrite>
  );
};

export default StoryWrite;

export async function storyFormAction({ request }: { request: any }) {
  const type = getFirstPathName();

  const formData = await request.formData();

  const eventData = {
    userId: null,
    type: type,
    content: formData.get('textArea'),
    image: imageFiles,
    productId: null,
    rate: null,
  };

  console.log(eventData);

  try {
    await pb.collection('boards').create(eventData);

    // 메모리 비우기
    imageFiles.splice(0, imageFiles.length);

    alert('스토리 작성이 완료됐습니다.');
  } catch (error) {
    console.log('Error while writing : ', error);
  }

  return redirect('/stories/');
}
