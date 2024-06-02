import {
  InterviewOptionType,
  QuestionType,
} from "@/app/(AfterLogin)/(interview)/_lib/contexts/InterviewOptionContext";
import { useGetQuestionsQuery, usePostQuestionsMutation } from "../../../_lib/queries/useQuestions";
import QuestionItem from "./QuestionItem";
import { Button } from "@/components/ui/button";
import AddQuestionModal from "./AddQuestionModal";
import { useModal } from "@/components/Modal/useModal";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/store/auth";

interface QuestionListProps {
  workbookId: number;
  onSelect: (id: number) => void;
  interviewOption: InterviewOptionType;
}

const QuestionList = ({ workbookId, onSelect, interviewOption }: QuestionListProps) => {
  const { data: questionList, isLoading } = useGetQuestionsQuery({ workbookId });
  const { openModal, closeModal } = useModal();
  const { mutate } = usePostQuestionsMutation();
  const userId = useRecoilValue(userIdState);

  const openAddQuestionModalHandler = () =>
    openModal(
      <AddQuestionModal
        closeModal={closeModal}
        // TODO: 인라인 함수 제거
        onSubmit={(questionContent, answerContent) => {
          mutate({
            userId,
            questionContent,
            answerContent,
            workbookId,
          });
          closeModal();
        }}
      />,
    );

  // TODO: 로딩 상태 처리
  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {questionList?.map((question) => (
        <QuestionItem
          key={question.questionId}
          id={question.questionId}
          content={question.questionContent}
          answer={question.answerContent}
          onSelect={onSelect}
          checked={interviewOption.questions.includes(question)}
        />
      ))}
      <li className="px-4 py-4 flex flex-col items-center justify-center border-b transition-colors hover:bg-muted/50 group">
        {questionList?.length === 0 && (
          <label className="text-gray-500">등록된 질문이 없습니다. 버튼을 눌러 추가해주세요.</label>
        )}
        <Button variant="outline" onClick={openAddQuestionModalHandler}>
          질문 & 답변 추가.
        </Button>
      </li>
    </ul>
  );
};

export default QuestionList;
