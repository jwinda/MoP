import { TypeTeamProjectUser } from '../../interfaces/User.interface';
import { getUsersByEmail } from '../../apis/Fetcher';
import { useEffect, useState } from 'react';
import styles from './MemberSelectForm.module.scss';
import UserProfileList from '../common/User/UserProfileList';

interface MemberSelectFormProps {
  selectedUserList: TypeTeamProjectUser[];
  onMemberSelect: (userData: TypeTeamProjectUser) => void;
  onMemberUnselect: (userId: number) => void;
}
function MemberSelectForm({
  selectedUserList,
  onMemberSelect,
  onMemberUnselect,
}: MemberSelectFormProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [userList, setUserList] = useState<TypeTeamProjectUser[]>([]);
  const [showSelectBox, setShowSelectBox] = useState(false);

  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
  };

  const getUsersBySearchTerm = async () => {
    const userListData = await getUsersByEmail(searchTerm);
    setUserList(userListData.data);
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      setShowSelectBox(true);
      getUsersBySearchTerm();
    }
    searchTerm.length === 0 && setShowSelectBox(false);
  }, [searchTerm]);

  return (
    <div className={styles.container}>
      <h4>프로젝트에 참여한 멤버를 선택해 주세요</h4>
      <div className={styles.secondContainer}>
        <div className={styles.searchUserListContainer}>
          <input
            type="text"
            placeholder="이메일로 검색해 주세요."
            value={searchTerm}
            onChange={(e) => handleSearchInputChange(e.target.value)}
          />
          {showSelectBox && (
            <ul>
              {userList.map((userData) => (
                <UserProfileList
                  key={userData.user_id}
                  userData={userData}
                  onUserClick={onMemberSelect}
                />
              ))}
            </ul>
          )}
        </div>
        <div className={styles.selectedUsersContainer}>
          <h4>선택 한 멤버</h4>
          {selectedUserList && (
            <ul>
              {selectedUserList.map((userData) => (
                <UserProfileList
                  key={userData.user_id}
                  userData={userData}
                  onUserUnselect={onMemberUnselect}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemberSelectForm;
