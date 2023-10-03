const planModel = require('../../models/planModels/planModel')
const subscriptionModel = require('../../models/planModels/subscriptionModel')
const traineeModel = require('../../models/userSideModels/userModel')


//////////////GET PLANS/////////////////

const plans = async (req, res) => {
    try {
        const plans = await planModel.find({ isActive: true }).select('-imageSrc -description')
        res.status(200).json({ plans })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ errMsg: "Server Error" })
    }
}


//////////////GET PLANS AND TRAINEE DETAILS/////////////////

const traineePlanDetails = async (req, res) => {
    try {
        const plans = await planModel.find({})
        const trainees = await traineeModel.find({})
        res.status(200).json({ plans, trainees })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ errMsg: "Server Error" })
    }
}

//////////////GET PLAN DETAILS/////////////////

const planDetails = async (req, res) => {
    try {
        const planId = req.params.planId;
        const plan = await planModel.findOne({ _id: planId });
        if (!plan) {
            return res.status(404).json({ errMsg: "Plan not found" });
        }
        res.status(200).json({ plan });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ errMsg: "Server Error" });
    }
};

//////////////MY PLAN DETAILS/////////////////

const myPlan = async (req, res) => {
    try {
        const userId = req.payload.id;
        const plan = await subscriptionModel
            .findOne({ user: userId })
            .populate('plan')
            .sort({ endDate: -1 })
            .exec();
        if (!plan) {
            return res.status(404).json({ errMsg: "Plan not found" });
        }
        res.status(200).json({ plan });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ errMsg: "Server Error" });
    }
};


//////////////ADD PLAN/////////////////

const addPlan = async (req, res) => {
    try {
        const { name, description, imageSrc, price, features } = req.body;
        const plan = await planModel.findOne({ name: name });
        if (plan) {
            return res.status(409).json({ errMsg: "Plan already exists" });
        } else {
            await planModel.create({
                name,
                description,
                imageSrc,
                price,
                features,
            });
            res.status(200).json({ message: "Plan added" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ errMsg: "Server Error" });
    }
};



//////////////ASSIGN PLAN/////////////////

const assignPlan = async (req, res) => {
    try {
        let { selectedTrainee, selectedplan } = req.body
        await traineeModel.updateOne({ _id: selectedTrainee }, { $set: { planId: selectedplan } })
        res.status(200).json({ message: `plan Asssigned` })

    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })
    }
}

//////////////UPDATE PLAN/////////////////

const updatePlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const { name, description, imageSrc, price, features } = req.body;

        const plan = await planModel.findById(planId);
        if (!plan) {
            return res.status(404).json({ errMsg: "Plan not found" });
        }

        const existingPlanWithSameName = await planModel.findOne({ _id: { $ne: planId }, name });
        if (existingPlanWithSameName) {
            return res.status(409).json({ errMsg: "Plan with the same name already exists" });
        }

        await planModel.findByIdAndUpdate(planId, {
            name,
            description,
            imageSrc,
            price,
            features,
        });

        res.status(200).json({ message: "Plan updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errMsg: "Server Error" });
    }
};



//////////////DELETE PLAN/////////////////

const deletePlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const isPlanIdUsedInTrainee = await traineeModel.find({ planId: planId })
        if (isPlanIdUsedInTrainee == null) {
            return res.status(400).json({ errMsg: 'Plan cannot be deleted as it is subscribed to a trainee' });
        }

        const deletedplan = await planModel.findByIdAndDelete(planId);

        if (!deletedplan) {
            return res.status(404).json({ errMsg: 'Plan not found' });
        }

        return res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errMsg: 'Internal server error' });
    }
};

//////////////CHANGE PLAN STATUS/////////////////

const planStatus = async (req, res) => {
    try {
        const { planId, status } = req.body

        if (status) {
            await planModel.updateOne({ _id: planId }, { $set: { isActive: false } })
            res.status(200).json({ message: 'Plan De-Activated' })

        } else {
            await planModel.updateOne({ _id: planId }, { $set: { isActive: true } })
            res.status(200).json({ message: 'Plan Activated' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ errMsg: "Server Error" })
    }
}

module.exports = {
    addPlan,
    plans,
    planDetails,
    traineePlanDetails,
    assignPlan,
    updatePlan,
    deletePlan,
    planStatus,
    myPlan,
}