// const sendToInterpreter = async (category: string, message: string) => {
//   try {
//     const [response, error] = await axiosPromise<ApiResponseInterpreter>(
//       fetcher("/interpreter/message", {
//         method: "POST",
//         data: {
//           message,
//           category,
//         },
//       })
//     );
//     if (!response || error) throw error;
//     console.log("### =>", response);

//     return response;
//   } catch (error) {
//     console.error(error);
//   }
// };

// const confirmInterpreterMessage = async (planUuid: string) => {
//   try {
//     // TODO: add type
//     const rawRequest = await fetcher(`/interpreter/plans/applied/${planUuid}`, {
//       method: "POST",
//     });
//     return { statusCode: rawRequest.status };
//   } catch (error) {
//     console.error(error);
//   }
// };
