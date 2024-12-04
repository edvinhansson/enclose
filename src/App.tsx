import { useEffect, useState } from 'react';
import './App.css';
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';
import { Badge, Button, Card, Collection, Divider, Flex, Heading, useAuthenticator, Text, View } from '@aws-amplify/ui-react';

type Device = Schema['devices']['type'];

const client = generateClient<Schema>();

function App() {
    const { user, signOut } = useAuthenticator();

    const [devices, setDevices] = useState<Device[]>([]);

    useEffect(() => {
        const sub = client.models.devices.observeQuery().subscribe({
            next: ({ items }) => {
                console.log([...items]);
                setDevices([...items]);
            },
        });
        return () => sub.unsubscribe();
    }, []);

    function createDevice() {
        const id = String(window.prompt("Device ID"));
        client.models.devices.create({ device_id: id, owner: user.userId });
    }

    function deleteDevice(deviceId: string) {
        client.models.devices.delete({ device_id: deviceId });
    }

    return (
        <main>
            <Flex padding="xs" direction="column" gap="15px">
                <Collection
                    items={devices}
                    type="list"
                    direction="column"
                    gap="20px"
                    wrap="nowrap"
                >
                {(item, index) => (
                    <Card
                        key={index}
                        borderRadius="medium"
                        variation="outlined"
                    >
                        <View padding="medium">
                            <Flex direction="row">
                                <Heading level={5}>{item.device_id}</Heading>
                                <Badge key={item.device_id} variation={item?.status == 'connected' ? 'success' : 'error'}>
                                    {item?.status ?? "unknown"}
                                </Badge>
                            </Flex>

                            {(item?.humidity && item?.status == 'connected') && (
                                <Text>humidity {item?.humidity}%</Text>
                            )}

                            <Divider padding="xs" />

                            <Flex direction="row-reverse" padding="xs">
                                <Button variation="destructive" onClick={() => deleteDevice(item.device_id)}>
                                    Delete
                                </Button>
                            </Flex>
                        </View>
                    </Card>
                )}
                </Collection>
                <Button onClick={createDevice} isFullWidth>Add device</Button>
                <Button onClick={signOut}>Sign out</Button>
            </Flex>
        </main>
    );
}

export default App;
