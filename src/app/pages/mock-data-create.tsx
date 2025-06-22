import { FC, useState } from "react";

import {
  Button,
  Checkbox,
  ConfigProvider,
  Form,
  Input,
  Modal,
  Select,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { produce } from "immer";
import store from "store2";

import { isNullable } from "@/shared/utils";
import { MinusCircleOutlined } from "@ant-design/icons";
import { faker } from "@faker-js/faker";

import { mockToolAxiosInstance } from "../apis/axios-instance";
import { LOCAL_STORAGE_KEY, Mock } from "../constants/storage";

const ALLOWED_FAKER_MODULES = [
  "date",
  "number",
  "string",
  "airline",
  "animal",
  "book",
  "color",
  "commerce",
  "company",
  "database",
  "finance",
  "food",
  "git",
  "hacker",
  "image",
  "internet",
  "location",
  "lorem",
  "music",
  "person",
  "phone",
  "science",
  "system",
  "vehicle",
  "word",
];

const getFakerMethods = () => {
  const methods: string[] = [];

  ALLOWED_FAKER_MODULES.forEach((module) => {
    // @ts-expect-error:next-line
    const fakerModule = faker[module];

    if (typeof fakerModule === "object") {
      Object.keys(fakerModule).forEach((fn) => {
        if (typeof fakerModule[fn] === "function") {
          methods.push(`${module}.${fn}`);
        }
      });
    }
  });

  return methods;
};

const generateMockData = (dynamicList: DynamicItem[]) => {
  const result: Record<string, unknown> = {};

  dynamicList.forEach(({ dataKey, dataType, dataValue }) => {
    let value = undefined;

    if (dataType === "faker") {
      const fakerDataValue = dataValue as string;

      const [module, fn] = fakerDataValue.split(".");

      // @ts-expect-error:next-line
      value = faker[module]?.[fn]?.();
    }

    if (dataType === "number") {
      value = Number(dataValue);
    }

    if (dataType === "string") {
      value = dataValue;
    }

    if (dataType === "boolean") {
      // Convert to boolean
      value = !!dataValue;
    }

    result[dataKey] = value;
  });

  return result;
};

const personOptions = getFakerMethods().map((method) => ({
  label: method,
  value: method,
}));

const updateStorageMockData = (path: string, data: unknown) => {
  const currentData: Mock = store.get(LOCAL_STORAGE_KEY.MOCK_API) ?? {};

  const updatedData = produce(currentData, (draft) => {
    // always update time
    draft.updateAt = dayjs().valueOf();

    if (!isNullable(path) && !isNullable(data)) {
      if (isNullable(draft.mockApi)) {
        draft.mockApi = {};
      }

      draft.mockApi[path] = data;
    }
  });

  store.set(LOCAL_STORAGE_KEY.MOCK_API, updatedData);
};

const DATA_TYPE_OPTIONS = [
  { label: "FakerJS", value: "faker" },
  { label: "String", value: "string" },
  { label: "Number", value: "number" },
  { label: "Boolean", value: "boolean" },
];

type DynamicItem = {
  dataKey: string;
  dataType: "faker" | "string" | "number" | "boolean";
  dataValue: string | boolean;
};

type FormValues = {
  path: string;
  dynamicFormList: DynamicItem[];
};

type MockDataCreateProps = unknown;

const MockDataCreate: FC<MockDataCreateProps> = () => {
  // #region hooks start
  const [form] = Form.useForm<FormValues>();

  const [mockApis, setMockApis] = useState<
    Array<{
      path: string;
      data: unknown;
    }>
  >([]);
  const [modalInfo, setModalInfo] = useState<{
    open: boolean;
    path: string;
    data: unknown;
  }>({
    open: false,
    path: "",
    data: undefined,
  });

  // #endregion hooks end

  // #region useEffect functions start
  // #endregion useEffect functions end

  // #region logic functions start
  const handleFinish = (values: FormValues) => {
    const { path, dynamicFormList } = values;

    const mockData = generateMockData(dynamicFormList);

    // set to state
    setMockApis(
      produce((draft) => {
        draft.push({
          path: path,
          data: mockData,
        });
      }),
    );

    // set to storage
    // NOTE register to axios in root
    updateStorageMockData(path, mockData);

    // reset form
    form.resetFields();
  };

  // #endregion logic functions end

  // #region render functions start
  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            itemMarginBottom: 8,
          },
        },
      }}
    >
      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[16px] p-[16px]">
          <Typography.Title className="self-center">
            MockDataCreate
          </Typography.Title>

          <Form
            form={form}
            name="mockForm"
            autoComplete="off"
            onFinish={handleFinish}
          >
            <Form.Item
              label="Api Path"
              name="path"
              rules={[{ required: true, message: "Path is required!" }]}
            >
              <Input placeholder="Enter API path, e.g. /zero" />
            </Form.Item>

            <Form.List name="dynamicFormList">
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} style={{ display: "flex" }}>
                        {/* Mock Data key */}
                        <Form.Item
                          {...restField}
                          name={[name, "dataKey"]}
                          rules={[
                            { required: true, message: "Field name required" },
                          ]}
                          style={{ flex: 1, marginRight: 8 }}
                        >
                          <Input placeholder="Field name" />
                        </Form.Item>

                        {/* Mock Data type */}
                        <Form.Item
                          {...restField}
                          name={[name, "dataType"]}
                          rules={[
                            { required: true, message: "Select data type" },
                          ]}
                          style={{ flex: 1, marginRight: 8 }}
                        >
                          <Select
                            placeholder="Data type"
                            options={DATA_TYPE_OPTIONS}
                          />
                        </Form.Item>

                        {/* Mock Data value */}
                        <Form.Item
                          shouldUpdate={(preV, curV) => {
                            return (
                              preV.dynamicFormList?.[name]?.dataType !==
                              curV.dynamicFormList?.[name]?.dataType
                            );
                          }}
                          style={{ flex: 2, marginRight: 8 }}
                        >
                          {({ getFieldValue }) => {
                            const dataType = getFieldValue([
                              "dynamicFormList",
                              name,
                              "dataType",
                            ]);

                            if (dataType === "faker") {
                              return (
                                <Form.Item
                                  {...restField}
                                  name={[name, "dataValue"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Select Faker method",
                                    },
                                  ]}
                                  noStyle
                                >
                                  <Select
                                    showSearch
                                    placeholder="Select person method"
                                    options={personOptions}
                                    filterOption={(input, option) => {
                                      if (option === undefined) {
                                        return false;
                                      }

                                      return option.label
                                        .toLowerCase()
                                        .includes(input.toLowerCase());
                                    }}
                                  />
                                </Form.Item>
                              );
                            }

                            if (dataType === "string") {
                              return (
                                <Form.Item
                                  {...restField}
                                  name={[name, "dataValue"]}
                                  rules={[
                                    { required: true, message: "Enter string" },
                                  ]}
                                  noStyle
                                >
                                  <Input placeholder="Enter string" />
                                </Form.Item>
                              );
                            }

                            if (dataType === "number") {
                              return (
                                <Form.Item
                                  {...restField}
                                  name={[name, "dataValue"]}
                                  rules={[
                                    { required: true, message: "Enter number" },
                                  ]}
                                  noStyle
                                >
                                  <Input
                                    type="number"
                                    placeholder="Enter number"
                                  />
                                </Form.Item>
                              );
                            }

                            if (dataType === "boolean") {
                              return (
                                <Form.Item
                                  {...restField}
                                  name={[name, "dataValue"]}
                                  valuePropName="checked"
                                  noStyle
                                >
                                  <Checkbox>True/False</Checkbox>
                                </Form.Item>
                              );
                            }

                            return <></>;
                          }}
                        </Form.Item>

                        <MinusCircleOutlined
                          className="!text-red-600"
                          onClick={() => remove(name)}
                        />
                      </div>
                    ))}

                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={async () => {
                          await form.validateFields();

                          add();
                        }}
                        block
                      >
                        Add
                      </Button>
                    </Form.Item>
                  </>
                );
              }}
            </Form.List>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create API
              </Button>
            </Form.Item>
          </Form>
        </div>

        <Typography.Title className="self-center">
          Mock API List
        </Typography.Title>

        <div className="mt-[24px] flex flex-wrap gap-[8px]">
          {mockApis.map(({ path }, index) => {
            return (
              <Button
                key={index}
                type="primary"
                onClick={() => {
                  setModalInfo({
                    open: true,
                    path: path,
                    data: undefined,
                  });
                }}
              >
                {path}
              </Button>
            );
          })}
        </div>
      </div>

      <Modal
        open={modalInfo.open}
        title={modalInfo.path}
        footer={<></>}
        onCancel={() =>
          setModalInfo({ open: false, path: "", data: undefined })
        }
        afterOpenChange={async (open) => {
          if (open) {
            // Fetch data or perform actions when modal opens
            const res = await mockToolAxiosInstance.post(modalInfo.path);
            console.log(res);
          }
        }}
      >
        <Typography>{modalInfo.path}</Typography>
      </Modal>
    </ConfigProvider>
  );
  // #endregion render functions end
};

export type { MockDataCreateProps };
export { MockDataCreate };
