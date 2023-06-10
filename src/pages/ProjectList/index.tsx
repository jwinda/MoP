import { useCallback, useEffect, useState } from 'react';
import { getProjects } from '../../apis/Fetcher';
import { TypeProjectList } from '../../interfaces/Project.interface';
import Category from '../../components/ProjectList/Category';
import ProjectList from '../../components/ProjectList/ProjectList';
import ProjectPostButton from '../../components/common/ProjectPostButton';
import ProjectSearch from '../../components/ProjectList/ProjectSearch';
import styles from './ProjectListMain.module.scss';
import RecruitingProjectFilter from '../../components/ProjectList/RecruitingProjectFilter';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

function ProjectListMain() {
  const [isLoading, setIsLoading] = useState(true);
  const [projectList, setProjectList] = useState<TypeProjectList[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [moreData, setMoreData] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [keywordValue, setKeywordValue] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [recruitingFilter, setRecruitingFilter] = useState('all');

  const getProjectListData = useCallback(async (): Promise<void> => {
    try {
      const projectList = await getProjects(
        selectedCategory,
        recruitingFilter,
        keywordValue,
        pageCount
      );
      const pageSize = projectList.data.pageSize;
      setPageSize(pageSize);
      pageSize <= 1 && setMoreData(false);

      setProjectList(projectList.data.pagenatedProjects);
    } catch (error: any) {
      if (error.message === '404') {
        setMoreData(false);
        setIsLoading(false);
        setProjectList([]);
      }
    } finally {
      setPageCount((prev) => prev + 1);
      setIsLoading(false);
    }
  }, [selectedCategory, recruitingFilter, keywordValue]);

  const getNextProjectListData = useCallback(async (): Promise<void> => {
    try {
      const projectList = await getProjects(
        selectedCategory,
        recruitingFilter,
        keywordValue,
        pageCount
      );
      //토탈 페이지 수의 전 페이지일 경우 moreData=false로 세팅해서 하단 로딩 컴포넌트 안보이게하기
      pageSize <= pageCount && setMoreData(false);
      setProjectList((prev) => [...prev, ...projectList.data.pagenatedProjects]);
      setPageCount((prev) => prev + 1);
    } catch (error: any) {
      if (error.message === '404') {
        setMoreData(false);
        setIsLoading(false);
        setProjectList([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, recruitingFilter, keywordValue, pageCount]);

  const target = useInfiniteScroll(async (entry, observer) => {
    //토탈 페이지 수의 페이지까지만 다음 페이지 데이터 업데이트하기
    pageSize >= pageCount && (await getNextProjectListData());
  });

  const handleCategoryClick = async (key: string) => {
    setSelectedCategory(key);
    setKeywordValue('');
    setPageCount(1);
    setMoreData(true);
  };

  const handleSearchChange = (keyword: string) => {
    setSelectedCategory('all');
    setKeywordValue(keyword);
    setPageCount(1);
    setMoreData(true);
    setIsSearched(true);
  };

  const handleRecruitingSelect = (value: string) => {
    setRecruitingFilter(value);
    setPageCount(1);
    setMoreData(true);
  };

  useEffect(() => {
    window.scroll(0, 0);
    getProjectListData();
  }, [selectedCategory, recruitingFilter]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      window.scroll(0, 0);
      if (isSearched === true) {
        getProjectListData();
      }
    }, 700); // 디바운스 타임 설정
    return () => clearTimeout(delayDebounceFn);
  }, [keywordValue, isSearched]);

  useEffect(() => {
    console.log('1');
  }, [getNextProjectListData]);

  useEffect(() => {
    console.log('2');
  }, [getProjectListData]);

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.leftContentContainer}>
          <Category selectedCategory={selectedCategory} handleClick={handleCategoryClick} />
          <ProjectPostButton />
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.searchContainer}>
          <ProjectSearch
            handleChange={handleSearchChange}
            value={keywordValue}
            isSearched={isSearched}
          />
          <RecruitingProjectFilter onChange={handleRecruitingSelect} />
        </div>
        <ProjectList
          projectList={projectList}
          isLoading={isLoading}
          moreData={moreData}
          innerRef={target}
        />
      </div>
    </div>
  );
}

export default ProjectListMain;
