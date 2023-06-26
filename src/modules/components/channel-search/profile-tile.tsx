import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { REGEX_USER_SPLITTING, REGEX_USER_TAGGING } from "../../../enums/regex";
import { useContext } from "react";
import { GeneralContext } from "../../contexts/generalContext";
import { SEARCHED_CONVERSATION_ID } from "../../../enums/localStorageConstants";

function renderAnswers(text: string) {
  let arr = [];
  let parts = text.split(REGEX_USER_SPLITTING);
  console.log("the parts are");
  console.log(parts);
  if (!!parts) {
    for (const matchResult of parts) {
      if (!!matchResult.match(REGEX_USER_TAGGING)) {
        let match: any = REGEX_USER_TAGGING.exec(matchResult);
        if (match !== null) {
          const { name, route } = match.groups;
          arr.push({
            key: name,
            route: route,
          });
        }
      } else {
        arr.push({
          key: matchResult,
          route: null,
        });
      }
    }
  }
}

const ProfileTile = ({ profile, setOpenSearch }: any) => {
  const generalContext = useContext(GeneralContext);
  function handleSearchNavigation() {
    generalContext.setShowLoadingBar(true);
    setOpenSearch(false);
    sessionStorage.setItem(SEARCHED_CONVERSATION_ID, profile?.id?.toString());
  }
  return (
    <div
      className="flex items-center my-4 p-2 mr-10  hover:bg-white cursor-pointer"
      onClick={handleSearchNavigation}
    >
      <ProfileImageView imgSource={profile.member?.image_url} />
      <ProfileData userName={profile.member?.name} answer={profile.answer} />
    </div>
  );
};

const ProfileImageView = ({ imgSource }: any) => {
  return (
    <div>
      <div className="rounded">
        {imgSource?.length !== 0 ? (
          <img
            src={imgSource}
            alt="profile data"
            className="rounded-full h-[48px] w-[48px]"
          />
        ) : (
          <AccountCircleIcon
            sx={{
              fontSize: "48px",
            }}
          />
        )}
      </div>
    </div>
  );
};

const ProfileData = ({ userName, answer }: any) => {
  return (
    <div className="grow pl-4">
      <div className="font-semibold">{userName}</div>
      <p className="text-ellipsis ">{answer}</p>
    </div>
  );
};

export default ProfileTile;
