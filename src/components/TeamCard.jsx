// TeamCard.jsx
import { useNavigate } from "react-router-dom";
import Avatar from "react-avatar";

const TeamCard = ({ team }) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-4 bg-gray-100 rounded-lg cursor-pointer hover:shadow-md"
      onClick={() => navigate(`/teams/${team._id}`)}
    >
      <h3 className="font-semibold mb-2">{team.name}</h3>
      <div className="flex -space-x-2">
        {team.members.slice(0, 5).map((member) => (
          <Avatar
            key={member._id}
            name={member.name}
            size="32"
            round={true}
            textSizeRatio={2}
          />
        ))}
        {team.members.length > 5 && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-xs">
            +{team.members.length - 5}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
