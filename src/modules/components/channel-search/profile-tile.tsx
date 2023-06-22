import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { REGEX_USER_SPLITTING, REGEX_USER_TAGGING } from "../../../enums/regex";

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

const ProfileTile = ({ profile }: any) => {
  return (
    <div className="flex items-center my-4">
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
          <img src={imgSource} alt="profile data" />
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
      <div className="text-ellipsis">{answer}</div>
    </div>
  );
};

export default ProfileTile;
