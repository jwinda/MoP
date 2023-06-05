// 현재 파일은 Fetcher의 예시를 적어둔 것이므로, 필요한대로 작성해서 쓰시면됩니다.
// 추천하는 mock 작성 방식은 API주소와 유사하게 작성하는 방법입니다.

import * as Api from './Api';
import * as ProjectType from '../interfaces/Project.interface';
import * as UserType from '../interfaces/User.interface';
import * as StackType from '../interfaces/Stack.interface';
import * as CommentType from '../interfaces/Comment.interface';
import { AxiosResponse } from 'axios';

const domain = `/mock`;

const DOMAIN = `http://34.64.242.119:5000/api/v1`;
const API_KEY = process.env.REACT_APP_API_KEY;

// 개별 프로젝트 불러오기
export async function getProject(projectId: number): Promise<ProjectType.TypeProject> {
  const params = `projects/info/${projectId}`;
  const response: AxiosResponse = await Api.get(API_KEY, params);
  return response.data;
}

// 코멘트 리스트 불러오기
export async function getComment(projectId: number): Promise<CommentType.TypeComment> {
  const params = `projects/${projectId}/comments`;
  return await Api.get(API_KEY, params, false);
}
export async function postComment(
  data: CommentType.TypeCommentPost
): Promise<CommentType.TypeCommentPost> {
  const params = `comments`;
  return await Api.post(API_KEY, params, data, true);
}
export async function putComment(
  commentId: number,
  data: CommentType.TypeComment
): Promise<CommentType.TypeComment> {
  const params = `comments/${commentId}`;
  return await Api.put(API_KEY, params, data, true);
}
export async function deleteComment(commentId: number): Promise<CommentType.TypeCommentPost> {
  const params = `comments/${commentId}`;
  return await Api.delete(API_KEY, params, '', true);
}

// 모든 프로젝트 리스트 불러오기
export async function getProjects(): Promise<{
  message: string;
  data: ProjectType.TypeProjectList[];
}> {
  const params = `projects`;
  return await Api.get(API_KEY, params, false);
}

// 카테고리로 프로젝트 리스트 불러오기
export async function getProjectsByCategory(
  categoryId: string
): Promise<{ message: string; data: ProjectType.TypeProjectList[] }> {
  const params = `projects/role/${categoryId}`;
  return await Api.get(API_KEY, params, false);
}

// 검색어로 프로젝트 리스트 불러오기
export async function getProjectsByKeyword(
  categoryId: string,
  keyword: string
): Promise<{ message: string; data: ProjectType.TypeProjectList[] }> {
  const params = `projects/cate=${categoryId}&search=${keyword}.json`;
  return await Api.get(domain, params, false);
}

// 모집 중 프로젝트 리스트 불러오기
export async function getRecruitingProjects(categoryId: string): Promise<{
  message: string;
  data: ProjectType.TypeProjectList[];
}> {
  const params = `projects/cate=${categoryId}&recruiting=true.json`;
  return await Api.get(domain, params, false);
}

export async function postProject(
  data: ProjectType.TypeProjectPost
): Promise<{ message: string; data: number }> {
  const params = `projects/recruitment`;
  return await Api.post(API_KEY, params, data, true);
}

// 유저 프로필 불러오기
export async function getUserProfile(): Promise<{
  message: string;
  data: UserType.TypeUserProfile;
}> {
  const params = `users/profile`;
  return await Api.get(API_KEY, params);
}
// n번 유저 프로필 불러오기
export async function getUserProfileById(userId: number): Promise<{
  message: string;
  data: UserType.TypeUserProfile;
}> {
  const params = `user/${userId}/profile.json`;
  return await Api.get(domain, params);
}

// stack 전체 데이터 불러오기
export async function getStackList(): Promise<{
  message: string;
  data: StackType.TypeStacks;
}> {
  const params = `stacks`;
  return await Api.get(DOMAIN, params, false);
}

// 유저 작성 게시글 불러오기
export async function getUserPosts(): Promise<{
  message: string;
  data: { user_projects: ProjectType.TypeUserPosts };
}> {
  const params = `projects/user`;
  return await Api.get(API_KEY, params, true);
}
// n번 유저 작성 게시글 불러오기
export async function getUserPostsById(userId: number): Promise<{
  message: string;
  data: { user_projects: ProjectType.TypeUserPosts };
}> {
  const params = `user/${userId}/projects.json`;
  return await Api.get(domain, params, true);
}

// 유저 정보 수정하기
export async function updateUserProfile(
  data: UserType.TypeUserProfile
): Promise<UserType.TypeUserProfile> {
  const params = `/user/profile.json`;
  // 나중에 마지막 매개변수 false -> true 로 수정해야 함
  return await Api.put(domain, params, data, false);
}

// 유저 작성 댓글 불러오기
export async function getUserComments(): Promise<{
  message: string;
  data: { project_comments: CommentType.TypeMypageComments };
}> {
  const params = `comments/user`;
  return await Api.get(API_KEY, params);
}
// 유저 작성 댓글 불러오기
export async function getUserCommentsById(userId: number): Promise<{
  message: string;
  data: { project_comments: CommentType.TypeMypageComments };
}> {
  const params = `user/${userId}/comments.json`;
  return await Api.get(domain, params);
}
