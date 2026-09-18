FROM public.ecr.aws/lambda/python:3.12

COPY src/ ${LAMBDA_TASK_ROOT}/
COPY requirements.txt .
RUN pip install -r requirements.txt -t ${LAMBDA_TASK_ROOT}/

CMD ["lambda_function.lambda_handler"]
