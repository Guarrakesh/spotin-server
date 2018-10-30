import moment from "moment";
import "moment/locale/it";

moment.locale('IT');

const eventSelectOptionRenderer = choice => {
  console.log(choice);
  return choice && `${choice.name} @ ${moment(choice.start_at).calendar()}`
};

export default eventSelectOptionRenderer;

